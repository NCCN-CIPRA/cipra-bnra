import { Box, Button, Stack } from "@mui/material";
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
import { RefObject, useMemo, useRef, useState } from "react";
import { UserRoles } from "../functions/authRoles";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../pages/BasePage";
import { Diff } from "@ali-tas/htmldiff-js";

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

function Editor({
  initialHTML,
  ref,
}: {
  initialHTML: string;
  ref: RefObject<RichTextEditorRef | null>;
}) {
  return (
    <>
      <Box sx={{ bgcolor: "white" }}>
        <RichTextEditor
          ref={ref}
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
          content={initialHTML} // Initial content for the editor
          // Optionally include `renderControls` for a menu-bar atop the editor:
          renderControls={() => <EditorMenuControls />}
          editorProps={{
            attributes: {
              class: "htmleditor",
            },
          }}
        >
          {() => (
            <>
              <LinkBubbleMenu formatHref={(v) => v} />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>
    </>
  );
}

export default function HTMLEditor({
  initialHTML,
  originalHTML,
  editableRole = "analist",
  isEditable = true,
  onSave,
}: {
  initialHTML: string;
  originalHTML?: string;
  editableRole?: keyof UserRoles;
  isEditable?: boolean;
  onSave: (newHTML: string) => unknown;
}) {
  const { user } = useOutletContext<BasePageContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);

  const handlePopoverOpen = () => {
    setShowButtons(true);
  };

  const handlePopoverClose = () => {
    setShowButtons(false);
  };

  const handleSave = async () => {
    await onSave(editorRef.current?.editor?.getHTML() || "");
    setIsEditing(false);
  };

  const diffHTML = useMemo(() => {
    if (originalHTML !== undefined && originalHTML !== initialHTML)
      return Diff.execute(originalHTML, initialHTML);
    return null;
  }, [originalHTML, initialHTML]);

  if (isEditing)
    return (
      <Box sx={{ mr: 2 }}>
        <Editor initialHTML={initialHTML} ref={editorRef} />
        <Stack direction="row" sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button variant="outlined" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    );

  return (
    <Box
      sx={{ position: "relative", mr: 2, minHeight: 50 }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      {user?.roles[editableRole] && isEditable && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            opacity: showButtons ? 1 : 0,
            transition: "all .2s ease",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {diffHTML !== null && !showDiff && (
            <Button
              variant="contained"
              color="info"
              aria-label="showDiff"
              sx={{ mr: 2 }}
              onClick={() => setShowDiff(true)}
            >
              Show Edits
            </Button>
          )}
          {showDiff && (
            <Button
              variant="contained"
              color="info"
              aria-label="showDiff"
              sx={{ mr: 2 }}
              onClick={() => setShowDiff(false)}
            >
              Hide Edits
            </Button>
          )}
          <Button
            variant="contained"
            color="warning"
            aria-label="edit"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </Box>
      )}
      <Box
        className="htmleditor"
        sx={{
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        }}
        dangerouslySetInnerHTML={{
          __html: showDiff && diffHTML !== null ? diffHTML : initialHTML,
        }}
      />
    </Box>
  );
}
