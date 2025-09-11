const AccountUserBodyProfilePicture = ({
  profilePictureUrl,
  altText,
}: {
  profilePictureUrl: string | undefined;
  altText?: string;
}) => {
  return (
    <>
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt={altText || "Profile picture"}
          className="profile-picture"
        />
      ) : (
        <div className="profile-picture placeholder">
          {altText ? altText.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </>
  );
};


export default AccountUserBodyProfilePicture;