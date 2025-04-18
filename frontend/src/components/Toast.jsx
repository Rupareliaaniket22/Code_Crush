const Toast = ({ text, action }) => {
  return (
    <div className="toast toast-end">
      <div
        className={`alert ${
          action === "failed" ? "alert-error" : "alert-success"
        } `}
      >
        <span>{text && text}</span>
      </div>
    </div>
  );
};

export default Toast;
