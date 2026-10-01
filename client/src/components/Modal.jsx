import { useEffect, useRef } from "react";

/** Native dialog: focus trap, Escape key and inert background come from the browser. */
export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="modal-body">
          <div className="modal-head">
            <h2>{title}</h2>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
