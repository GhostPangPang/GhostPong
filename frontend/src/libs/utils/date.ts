export const formatRelativeDate = (date: string | Date | null) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    const minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }
};

// format time
export const formatTime = (date: string | Date | null) => {
  if (!date) return '';
  const d = new Date(date);
  const hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours() === 0 ? 12 : d.getHours();
  const minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${hour}:${minute} ${ampm}`;
};
