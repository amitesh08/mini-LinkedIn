const Avatar = ({ name = "", size = "32" }) => {
  const getInitials = () => {
    if (!name || name.trim() === "") return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shadow-md`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.2}px`,
        backgroundColor: "#f0f0f0",
      }}
    >
      <span>{getInitials()}</span>
    </div>
  );
};

export default Avatar;
