import {useEffect, useRef, useState} from "react";
import { IoClose } from "react-icons/io5";
import clsx from "clsx";
import * as musicMetadata from 'music-metadata-browser';
import MetadataInput from "./MetadataInput";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
type Props = {
  toggleModal: ()=>void;
}

type metadata = {
  title?: string,
  artist?: string,
  genre?: string,
  album?: string,
  track?: number,
  userID?: string,
}

const ModalComponent = ({toggleModal}:Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<musicMetadata.IAudioMetadata|null>(null);
  const [editMetadata, setEditMetadata] = useState<metadata>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragStyles, setDragStyles] = useState<string>("");
  const [errorMessage,setErrorMessage] = useState<string | null>();
  const {data:session} = useSession();
  const router = useRouter();
  useEffect(()=>{
    document.addEventListener('keydown', (e)=>{
      if(e.key === "Escape")
        toggleModal();
    });
  

    return ()=>{
      document.removeEventListener('keydown',()=>{});
    }
  },[])

  useEffect(()=>{
    if(file)
      console.log(file)
  },[file])

  const handleBrowserClick = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>)=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleDrop = async(e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    const metadata = await musicMetadata.parseBlob(droppedFile);
    console.log(metadata);
    setFileMetadata(metadata);
    setEditMetadata({
      title:metadata.common.title,
      album:metadata.common.album,
      artist:metadata.common.artist,
      genre:metadata.common.genre&&metadata.common.genre[0],
      track:metadata.common.track.no || 0
    });
    //console.log(metadata);
    setFile(droppedFile);
    setDragStyles("");
  };

  const handleDragOver = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(dragStyles == "")
      setDragStyles("border-white");
  };

  const handleDragLeave = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(dragStyles != "")
      setDragStyles("");
  };

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files&&e.target.files[0])
      setFile(e.target.files[0]);
  };

  const handleSubmit = async()=>{
    if(file && fileMetadata){
      const formData = new FormData();
      if(editMetadata)
        editMetadata.userID = session?.user.data?.id;
      formData.append("file", file);
      formData.append("fileMetadata", JSON.stringify(editMetadata));
      console.log(JSON.stringify(editMetadata));
      const res = await fetch('/api/music',{
        method: 'POST',
        body: formData,
      });
      console.log(res.status)
      if(res.status === 200){
        console.log('submitted successfully');
        toggleModal();
        router.refresh();
      }else{
        console.log(`couldn't submit file ${res.status}`)
      }
    }else{
      createError("file is missing please try again!")
    }
  }

  const createError = (e:string)=>{
    setErrorMessage(e);
    setTimeout(()=>{
      setErrorMessage(null)
    },3000);
  }

  const onInputChange = (id: string, value: string)=>{
    id = id.toLowerCase();
    setEditMetadata((prevMetadata)=>{
      return {
        ...prevMetadata,
        [id]: value
      }
    });
  }


  return <>
    <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-40 flex justify-center items-center" onClick={toggleModal}>
      <div className="bg-componentBg rounded-lg w-[35rem] xl:w-[50rem]" onClick={(e)=>{e.stopPropagation();}}>
        <div className="flex justify-between pt-6 pb-2 px-6 items-center">
          <div className="w-full">
          {errorMessage&&(
            <div className="bg-rose-500 rounded-lg p-2 w-full">
              {errorMessage}
            </div>
          )}
          </div>
        
          <IoClose size={32} className="cursor-pointer ml-3" onClick={toggleModal}/>
        </div>
        
        
        <div className="p-5">
          <h1 className="text-xl pb-10">File Upload</h1>
          <div className={clsx("border-2 border-dashed border-green-400 p-20 w-full",dragStyles)} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={handleBrowserClick}>
              <div className="flex justify-center items-center">
                <span className="font-bold">Drag & Drop or <span className="text-green-400 cursor-pointer">Browse</span></span>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
              </div>
            </div>
          
          <div className="pt-10 flex gap-2">
 
            
            <div className="grid grid-cols-2 gap-2 col-start-1 w-full">
              <MetadataInput label="Title" value={fileMetadata?.common.title} onInputChange={onInputChange}/>
              <MetadataInput label="Album" value={fileMetadata?.common.album} onInputChange={onInputChange}/>
              <MetadataInput label="Artist" value={fileMetadata?.common.artist} onInputChange={onInputChange}/>
              <MetadataInput label="Genre" value={fileMetadata?.common.genre&&fileMetadata.common.genre[0]} onInputChange={onInputChange}/>
              <MetadataInput label="Track" value={fileMetadata?.common.track.no || ""} onInputChange={onInputChange}/>
            </div>
            {fileMetadata?.common.picture&&(
                <Image className="" width={200} height={200} src={`data:${fileMetadata?.common.picture[0].format};base64,${fileMetadata?.common.picture[0].data.toString('base64')}`} alt="song_img" />
            )}
            
            
          </div>
        </div>
        <div className="flex justify-center pb-5">
          <button className="bg-green-500 py-2 px-3 rounded-lg hover:bg-green-600" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  </>
}

export default ModalComponent