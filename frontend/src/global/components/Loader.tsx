import '../../../public/root/components/loader.scss';

const Loader = ({
    loading
} : {
    loading: boolean
}) => {
  return (
    <div
      className="naflows__button__loader"
      style={{
        display: loading ? "block" : "none",
      }}
    >
      <div className="naflows__button__loader__content"></div>
    </div>
  );
};


export default Loader;