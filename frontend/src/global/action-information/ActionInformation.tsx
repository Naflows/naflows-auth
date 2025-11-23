import { useEffect } from "react";

export default function ActionInformation({
  title,
  description,
  action1,
  action2,
  type,
  onClose
}: {
  title: string;
  description: string;
  action1: (() => void) | null;
  action2: (() => void) | null;
  type: 'info' | 'warning' | 'error';
  onClose: () => void;
}) {
  // This notification should be hidden after some time or when the user clicks close
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`action-information ${type}`}>
      <h4>
        <span>{title}</span>
      </h4>
      <p>{description}</p>
      <div className="actions">
        {action1 && <button onClick={action1}>Action 1</button>}
        {action2 && <button onClick={action2}>Action 2</button>}
      </div>
    </div>
  );
}