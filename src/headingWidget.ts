import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { editorLivePreviewField, Menu } from "obsidian";
import { syntaxTree, lineClassNodeProp } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

const headingLevels = [1, 2, 3, 4, 5, 6];
const MARKER_CSS_CLASS = "cm-heading-marker";

class HeadingMarkerWidget extends WidgetType {
  constructor(
    readonly view: EditorView,
    readonly headingLevel: number,
    readonly lineFrom: number
  ) {
    super();
  }

  eq(other: HeadingMarkerWidget) {
    return this.headingLevel === other.headingLevel && this.lineFrom === other.lineFrom;
  }

  toDOM() {
    const markerEl = createSpan({ cls: MARKER_CSS_CLASS });
    markerEl.dataset.level = String(this.headingLevel);
    markerEl.setAttribute("aria-label", `Heading ${this.headingLevel}. Activate to change heading level.`);
    markerEl.setAttribute("role", "button");
    markerEl.tabIndex = 0;

    const openMenu = (evt: MouseEvent) => {
      if (markerEl.classList.contains("has-active-menu")) return;
      const menu = new Menu();
      for (const level of headingLevels) {
        menu.addItem((item) =>
          item
            .setIcon("lucide-heading-" + level)
            .setTitle(`Heading ${level}`)
            .setChecked(level === this.headingLevel)
            .onClick(() => this.setHeadingLevel(level))
        );
      }
      menu.addItem((item) =>
        item
          .setIcon("lucide-text")
          .setTitle("Body")
          .onClick(() => this.setHeadingLevel(0))
      );
      menu.setParentElement(markerEl).showAtMouseEvent(evt);
    };

    markerEl.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      openMenu(evt);
    });
    markerEl.addEventListener("mousedown", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    });
    markerEl.addEventListener("keydown", (evt) => {
      if (evt.key !== "Enter" && evt.key !== " ") return;
      evt.preventDefault();
      evt.stopPropagation();
      const rect = markerEl.getBoundingClientRect();
      openMenu(new MouseEvent("click", { clientX: rect.left, clientY: rect.bottom, bubbles: true }));
    });

    return markerEl;
  }

  private setHeadingLevel(level: number) {
    const line = this.view.state.doc.lineAt(this.lineFrom);
    const lineContents = line.text.replace(/^#{1,6}\s+/, "");
    const insert = level === 0 ? lineContents : `${"#".repeat(level)} ${lineContents}`;
    this.view.dispatch({
      changes: { from: line.from, to: line.to, insert },
    });
  }

  ignoreEvent() {
    return false;
  }
}

interface HeadingMarkerPluginOpts {
  showInSourceMode: boolean;
}

export function headingMarkerPlugin(opts: HeadingMarkerPluginOpts) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.shouldRender(view) ? this.buildDecorations(view) : Decoration.none;
      }

      shouldRender(view: EditorView) {
        return opts.showInSourceMode || view.state.field(editorLivePreviewField);
      }

      buildDecorations(view: EditorView) {
        const builder = new RangeSetBuilder<Decoration>();
        for (const visibleRange of view.visibleRanges) {
          syntaxTree(view.state).iterate({
            from: visibleRange.from,
            to: visibleRange.to,
            enter: ({ type, from }) => {
              const headingExp = /header-(\d)$/.exec(type.prop(lineClassNodeProp) ?? "");
              if (!headingExp) return;
              const headingLevel = Number(headingExp[1]);
              const lineFrom = view.state.doc.lineAt(from).from;
              const widget = Decoration.widget({
                widget: new HeadingMarkerWidget(view, headingLevel, lineFrom),
                side: -1,
              });
              builder.add(lineFrom, lineFrom, widget);
            },
          });
        }
        return builder.finish();
      }

      update(update: ViewUpdate) {
        if (!this.shouldRender(update.view)) {
          this.decorations = Decoration.none;
          return;
        }
        if (update.docChanged || update.viewportChanged || update.geometryChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }
    },
    { decorations: (value) => value.decorations }
  );
}
