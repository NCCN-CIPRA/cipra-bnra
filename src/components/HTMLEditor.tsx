import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
  MenuButton,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
  TableImproved,
  type RichTextEditorRef,
  MenuButtonCodeProps,
  useRichTextEditorContext,
} from "mui-tiptap";
import { Extension } from "@tiptap/react";
import { Link } from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { UserRoles } from "../functions/authRoles";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../pages/BasePage";
import { Diff } from "@ali-tas/htmldiff-js";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { RiskFilePageContext } from "../pages/BaseRiskFilePage";
import useAPI from "../hooks/useAPI";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export function RiskLabelExtension(riskLabels: Record<string, string>) {
  return Extension.create({
    name: "riskLabelDecorations",

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("riskLabelDecorations"),
          props: {
            decorations(state) {
              const decorations: Decoration[] = [];

              state.doc.descendants((node, pos, _parent, _index) => {
                if (!node.isText) return;

                const linkMark = node.marks.find(
                  (m) =>
                    m.type.name === "link" &&
                    m.attrs.href?.indexOf("/risks/") >= 0,
                );
                if (!linkMark) return;

                const boldMark = node.marks.find((m) => m.type.name === "bold");
                if (!linkMark || !boldMark) return;

                // Check if the immediately preceding sibling is a numbered prefix like "1. "
                // if (index === 0 || !parent) return;
                // const prevNode = parent.child(index - 1);
                // if (!prevNode.isText || !/\d+\.\s*$/.test(prevNode.text ?? ""))
                //   return;

                const riskId = linkMark.attrs.href.split("/risks/")[1];
                const label = riskLabels[riskId];
                if (!label) return;

                decorations.push(
                  Decoration.widget(
                    pos + node.nodeSize,
                    () => {
                      const el = document.createElement("span");
                      el.className = "risk-link-label";
                      el.textContent = label;
                      return el;
                    },
                    { side: 1 },
                  ),
                );
              });

              return DecorationSet.create(state.doc, decorations);
            },
          },
        }),
      ];
    },
  });
}

function RiskLinkMenuButton(props: MenuButtonCodeProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Create link to another risk file"
      IconComponent={LocalLibraryIcon}
      onClick={() => editor?.chain().focus().openLinkPicker().run()}
      {...props}
    />
  );
}

function SourceLinkMenuButton(props: MenuButtonCodeProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Create reference to a bibliography source"
      IconComponent={InsertLinkIcon}
      onClick={() => editor?.chain().focus().openSourcePicker().run()}
      {...props}
    />
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    insertRiskLinkPicker: {
      openLinkPicker: () => ReturnType;
      insertLinkFromPicker: ({
        label,
        href,
      }: {
        label: string;
        href: string;
      }) => ReturnType;
    };
    insertSourcePicker: {
      openSourcePicker: () => ReturnType;
      insertSourceFromPicker: ({ id }: { id: number }) => ReturnType;
    };
  }
}

const InsertLinkPicker = Extension.create({
  name: "insertRiskLinkPicker",

  addCommands() {
    return {
      openLinkPicker: () => () => {
        // This doesn’t insert anything by itself;
        // you’ll use it to tell the UI to open.
        window.dispatchEvent(new CustomEvent("tiptap-open-link-picker"));
        return true;
      },
      insertLinkFromPicker:
        (attrs: { label: string; href: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "text",
            text: attrs.label,
            marks: [
              {
                type: "link",
                attrs: { href: attrs.href },
              },
            ],
          });
        },
    };
  },
});

const InsertSourcePicker = Extension.create({
  name: "insertSourcePicker",

  addCommands() {
    return {
      openSourcePicker: () => () => {
        // This doesn’t insert anything by itself;
        // you’ll use it to tell the UI to open.
        window.dispatchEvent(new CustomEvent("tiptap-open-source-picker"));
        return true;
      },
      insertSourceFromPicker:
        (attrs: { id: number }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "text",
            text: `(${attrs.id})`,
            marks: [
              {
                type: "link",
                attrs: { href: `#ref-${attrs.id}` },
              },
            ],
          });
        },
    };
  },
});

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
      <MenuDivider />
      <RiskLinkMenuButton />
      <SourceLinkMenuButton />
    </MenuControlsContainer>
  );
}

function RiskLinkPicker({
  editor,
}: {
  editor: RefObject<RichTextEditorRef | null>;
}) {
  const [open, setOpen] = useState(false);
  const { smallRiskMap } = useOutletContext<BasePageContext>();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("tiptap-open-link-picker", handler);
    return () => window.removeEventListener("tiptap-open-link-picker", handler);
  }, []);

  const handleSelect = (item: SmallRisk) => {
    editor.current?.editor
      ?.chain()
      .focus()
      .insertLinkFromPicker({
        label: item.cr4de_title,
        href: `/risks/${item.cr4de_riskfilesid}`,
      })
      .run();
    setOpen(false);
  };

  const risks = useMemo(
    () =>
      Object.values(smallRiskMap).sort((a, b) =>
        a.cr4de_title.localeCompare(b.cr4de_title),
      ),
    [smallRiskMap],
  );

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box sx={{ m: 2, width: 300, textAlign: "right" }}>
        <Autocomplete
          options={risks}
          getOptionLabel={(o) => o.cr4de_title}
          onChange={(_, value) => value && handleSelect(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select or type a risk file" />
          )}
        />
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleSelect}>
          Add Link
        </Button>
      </Box>
    </Dialog>
  );
}

function SourcePicker({
  editor,
}: {
  editor: RefObject<RichTextEditorRef | null>;
}) {
  const [open, setOpen] = useState(false);
  const api = useAPI();

  const { attachments } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("tiptap-open-source-picker", handler);
    return () =>
      window.removeEventListener("tiptap-open-source-picker", handler);
  }, []);

  const handleSelect = (item: DVAttachment) => {
    if (!attachments) return;

    let ref = item.cr4de_reference;

    if (ref === null) {
      const newReference =
        Math.max(
          ...(attachments
            .filter((a) => a.cr4de_reference !== null)
            .map((a) => a.cr4de_reference) as number[]),
        ) + 1;

      api.updateAttachmentFields(item.cr4de_bnraattachmentid, {
        cr4de_reference: newReference,
      });

      ref = newReference;
    }

    editor.current?.editor
      ?.chain()
      .focus()
      .insertSourceFromPicker({
        id: ref,
      })
      .run();
    setOpen(false);
  };

  if (!attachments) return null;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box sx={{ m: 2, width: 500 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          If your source is not in the list, or you want to add a new attachment
          to the risk file, use the bibliography section at the bottom of the
          analysis page.
        </Typography>
        <Autocomplete
          options={attachments}
          getOptionLabel={(o) => o.cr4de_name}
          onChange={(_, value) => value && handleSelect(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select an attachment" />
          )}
        />
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => handleSelect}
          >
            Add Reference
          </Button>
        </Box>
      </Box>
    </Dialog>
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
        <RiskLinkPicker editor={ref} />
        <SourcePicker editor={ref} />
        <RichTextEditor
          ref={ref}
          extensions={[
            StarterKit.configure({
              link: false,
              gapcursor: false,
              dropcursor: false,
            }),
            TableImproved,
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
              types: ["heading", "paragraph", "image"],
            }),
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
            InsertLinkPicker,
            InsertSourcePicker,
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
  queryKeyToInvalidate,
  riskLabels = { "9858db5b-aa6c-ed11-9561-000d3adf7089": "Test" },
}: {
  initialHTML: string;
  originalHTML?: string;
  editableRole?: keyof UserRoles;
  isEditable?: boolean;
  onSave: UseMutationResult<void, Error, string, unknown>;
  queryKeyToInvalidate: string[] | undefined;
  riskLabels?: Record<string, string>;
}) {
  const queryClient = useQueryClient();

  const { user } = useOutletContext<BasePageContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePopoverOpen = () => {
    setShowButtons(true);
  };

  const handlePopoverClose = () => {
    setShowButtons(false);
  };

  const handleSave = async () => {
    setIsPending(true);

    onSave.mutate(editorRef.current?.editor?.getHTML() || "", {
      onSuccess: async () => {
        if (queryKeyToInvalidate) {
          await queryClient.invalidateQueries({
            queryKey: queryKeyToInvalidate,
          });
        }

        setIsPending(false);
        setIsEditing(false);
      },
      onError: () => {
        setIsPending(false);
      },
    });
  };

  const diffHTML = useMemo(() => {
    if (originalHTML !== undefined && originalHTML !== initialHTML)
      return Diff.execute(originalHTML, initialHTML);
    return null;
  }, [originalHTML, initialHTML]);

  if (isEditing)
    return (
      <Box sx={{ mr: 2, position: "relative" }}>
        {onSave.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong while saving. Backup your text and try again or
            yell really loud.
          </Alert>
        )}
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
        {isPending && (
          <Box
            sx={{
              position: "absolute",
              top: -10,
              bottom: -10,
              left: 0,
              right: -10,
              backgroundColor: "rgba(255,255,255,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ mb: 1 }} />
            Saving
          </Box>
        )}
      </Box>
    );

  return (
    <Box
      sx={{ position: "relative", mr: 2, minHeight: 50 }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <RichTextReadOnly
        content={initialHTML}
        extensions={[
          StarterKit.configure({ gapcursor: false, dropcursor: false }),
          Link,
          RiskLabelExtension(riskLabels), // ← add here, not in the editable Editor
        ]}
      />
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
    </Box>
  );
}
