import { useFileUrl } from "../hooks";
import { msg } from "../i18n";
import { m } from "../i18n/messages/fileThumb";
import type { FileRef } from "../types";
import { Icon } from "./Icon";

export function FileThumb({ file, onClick }: { file: FileRef; onClick?: () => void }) {
  const t = msg(m);
  const url = useFileUrl(file.type.startsWith("image/") ? file.id : undefined);
  return (
    <button className="thumb" onClick={onClick} aria-label={t.open(file.name)}>
      {url ? (
        <img src={url} alt="" loading="lazy" />
      ) : (
        <span className="thumb__file">
          <Icon name="file" size={20} />
          <small>{file.name}</small>
        </span>
      )}
    </button>
  );
}
