import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonHorizontalRule,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditor,
  TableBubbleMenu,
  TableImproved,
  type RichTextEditorRef,
} from "mui-tiptap";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import NCCNLoader from "../../components/NCCNLoader";
import { DVPage } from "../../types/dataverse/DVPage";
import Fab from "@mui/material/Fab";
import SaveIcon from "@mui/icons-material/Save";

enum EMAIL {
  NONE = "None",
  INVITATION = "invitation",
}

enum LANGUAGE {
  EN = "cr4de_content_en",
  NL = "cr4de_content_nl",
  FR = "cr4de_content_fr",
  DE = "cr4de_content_de",
}

const PARAMS = {
  [EMAIL.NONE]: null,
  [EMAIL.INVITATION]: [
    {
      display: "{{ Registration URL }}",
      description: "A link to the registration page",
    },
    {
      display: "{{ Full Name }}",
      description:
        "De naam en voornaam van de persoon naar wie de email verstuurd wordt.",
    },
  ],
};

function EditorMenuControls() {
  return (
    <MenuControlsContainer>
      <MenuSelectHeading />
      <MenuDivider />
      <MenuButtonBold />
      <MenuButtonItalic />
      <MenuButtonUnderline />
      <MenuButtonStrikethrough />
      <MenuDivider />
      <MenuSelectTextAlign />
      <MenuDivider />
      <MenuButtonOrderedList />
      <MenuButtonBulletedList />
      <MenuDivider />
      <MenuButtonBlockquote />
      <MenuDivider />
      <MenuButtonCode />
      <MenuButtonCodeBlock />
      <MenuDivider />
      <MenuButtonHorizontalRule />
      <MenuButtonAddTable />
      <MenuDivider />
      <MenuButtonRemoveFormatting />
      <MenuDivider />
      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}

export default function EmailManagementTab() {
  const api = useAPI();
  const [email, setEmail] = useState<EMAIL>(EMAIL.NONE);
  const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.NL);
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const rteRef = useRef<RichTextEditorRef>(null);

  const { data: emailTemplates } = useRecords<DVPage>({
    table: DataTable.PAGE,
    query: "$filter=startswith(cr4de_name, 'email-')",
  });

  useEffect(() => {
    if (!rteRef.current || !rteRef.current.editor || !emailTemplates) return;

    const t = emailTemplates.find(
      (t) => t.cr4de_name.toLowerCase().indexOf(email.toLowerCase()) >= 0
    );

    if (!t) return;

    rteRef.current.editor.commands.setContent(t[language]);
  }, [email, emailTemplates, language]);

  const handleChangeEmail = (e: SelectChangeEvent<EMAIL>) => {
    setEmail(e.target.value as EMAIL);
  };

  const handleChangeLanguage = (e: SelectChangeEvent<LANGUAGE>) => {
    setLanguage(e.target.value as LANGUAGE);
  };

  if (!emailTemplates)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  const currentTemplate = emailTemplates.find(
    (t) => t.cr4de_name.toLowerCase().indexOf(email.toLowerCase()) >= 0
  );

  const handleSave = async () => {
    if (
      currentTemplate &&
      email !== EMAIL.NONE &&
      rteRef.current &&
      rteRef.current.editor
    ) {
      setIsSaving(true);

      await api.updatePage(currentTemplate?.cr4de_bnrapageid, {
        [language]: rteRef.current?.editor?.getHTML(),
      });
      setIsSaving(false);
      setHasChanged(false);
    }
  };

  return (
    <>
      <Container>
        <Paper sx={{ p: 2, mb: 15 }}>
          <Stack direction="column" rowGap={2}>
            <Stack direction="row">
              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="mail-select-label">Email Template</InputLabel>
                <Select
                  labelId="mail-select-label"
                  id="mail-select"
                  value={email}
                  label="Email Template"
                  onChange={handleChangeEmail}
                >
                  <MenuItem value={EMAIL.NONE}></MenuItem>
                  <MenuItem value={EMAIL.INVITATION}>Invitation Email</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200, ml: 2 }}>
                <InputLabel id="lan-select-label">Language</InputLabel>
                <Select
                  labelId="lan-select-label"
                  id="lan-select"
                  value={language}
                  label="Language"
                  onChange={handleChangeLanguage}
                >
                  <MenuItem value={LANGUAGE.NL}>NL</MenuItem>
                  <MenuItem value={LANGUAGE.FR}>FR</MenuItem>
                  <MenuItem value={LANGUAGE.EN}>EN</MenuItem>
                  <MenuItem value={LANGUAGE.DE}>DE</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Typography variant="h6">Available parameters</Typography>
            {PARAMS[email] ? (
              <Stack direction="column">
                {PARAMS[email].map((p) => (
                  <Stack direction="row">
                    <Typography variant="subtitle1">{p.display}</Typography>

                    <Typography variant="body1">{p.description}</Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1">None</Typography>
            )}
            {currentTemplate && (
              <RichTextEditor
                ref={rteRef}
                extensions={[
                  StarterKit,
                  TableImproved,
                  TableRow,
                  TableHeader,
                  TableCell,
                  Underline,
                  Link.configure({
                    // autolink is generally useful for changing text into links if they
                    // appear to be URLs (like someone types in literally "example.com"),
                    // though it comes with the caveat that if you then *remove* the link
                    // from the text, and then add a space or newline directly after the
                    // text, autolink will turn the text back into a link again. Not ideal,
                    // but probably still overall worth having autolink enabled, and that's
                    // how a lot of other tools behave as well.
                    autolink: true,
                    linkOnPaste: true,
                    openOnClick: false,
                  }),
                  LinkBubbleMenuHandler,
                ]} // Or any Tiptap extensions you wish!
                content={currentTemplate[language]} // Initial content for the editor
                // Optionally include `renderControls` for a menu-bar atop the editor:
                renderControls={() => <EditorMenuControls />}
                onUpdate={() => setHasChanged(true)}
              >
                {() => (
                  <>
                    <LinkBubbleMenu formatHref={(v) => v} />
                    <TableBubbleMenu />
                  </>
                )}
              </RichTextEditor>
            )}
          </Stack>
        </Paper>
      </Container>
      <Zoom in={hasChanged} timeout={500} unmountOnExit>
        <Fab
          size="large"
          color="primary"
          variant="extended"
          sx={{
            position: "fixed",
            bottom: 96,
            right: 32,
          }}
          onClick={handleSave}
        >
          {isSaving ? (
            <CircularProgress />
          ) : (
            <>
              <SaveIcon sx={{ mr: 1 }} /> Save
            </>
          )}
        </Fab>
      </Zoom>
    </>
  );
}
