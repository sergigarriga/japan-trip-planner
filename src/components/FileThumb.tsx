import { useFileUrl } from "../hooks";
import type { FileRef } from "../types";
import { Icon } from "./Icon";

export function FileThumb({ file, onClick }: { file: FileRef; onClick?: () => void }) {
  const url = useFileUrl(file.type.startsWith("image/") ? file.id : undefined);
  return (
    <button className="thumb" onClick={onClick} aria-label={`Abrir ${file.name}`}>
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
