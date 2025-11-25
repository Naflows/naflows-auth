
export interface AlertContentProps {
  success: boolean;
  status: number;
  message: string | React.JSX.Element; // Message is a HTML body
  closeAlert: boolean;
  title?: string;
  displayCode?: boolean;
  customClose?: {
    text: string; action: () => void;
    additionalButton?: { content: React.JSX.Element; action: () => void; class?: string }; // Optional additional button
  },
  displaySuccess?: boolean; // If true, will display a success message even if status is not 200
}
export interface AlertProps {
  alert: AlertContentProps;
  setAlert: (alert: AlertProps["alert"]) => void;
}
