/** Helpers for driving Bootstrap modals without importing the Bootstrap JS API. */

export const openModal = (modalId: string): void => {
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.setAttribute("data-bs-toggle", "modal");
  trigger.setAttribute("data-bs-target", `#${modalId}`);
  trigger.style.display = "none";

  document.body.appendChild(trigger);
  trigger.click();
  document.body.removeChild(trigger);
};

/**
 * Closes the modal that is currently open and opens another one once Bootstrap has
 * finished its hide transition. Opening immediately would leave a stale backdrop behind.
 */
export const switchModal = (fromModalId: string, toModalId: string): void => {
  const current = document.getElementById(fromModalId);

  if (!current || !current.classList.contains("show")) {
    openModal(toModalId);
    return;
  }

  const handleHidden = () => {
    current.removeEventListener("hidden.bs.modal", handleHidden);
    openModal(toModalId);
  };

  current.addEventListener("hidden.bs.modal", handleHidden);

  const dismiss = current.querySelector<HTMLElement>("[data-bs-dismiss='modal']");
  if (dismiss) {
    dismiss.click();
  } else {
    current.removeEventListener("hidden.bs.modal", handleHidden);
    openModal(toModalId);
  }
};
