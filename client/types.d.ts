

type song = {
  index: number,
  songID: string,
  title: string,
  album?: string,
  artist: string,
  genre?: string,
  duration: number,
  track?: number,
  liked: boolean,
  userID?: string,
}

type likedSongs = {
  songID: string,
  dateAdded: string,
}[]

type userData = {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  regDate: string;
  lastLogin: string;
  status: string;
  role: string;
  likedSongs: likedSongs
}





