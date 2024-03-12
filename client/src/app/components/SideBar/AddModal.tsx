import {useState, useRef, useEffect} from "react";
import { createPortal } from 'react-dom';
import { FaPlus } from "react-icons/fa";
import ModalComponent from "./ModalComponent";
const AddModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  }
  return (<>
    <div className="text-white/60 transition hover:text-white/100 cursor-pointer" onClick={toggleModal}>
      <FaPlus size="18"/>
    </div>
    {isOpen&&document.body&&(createPortal(<ModalComponent toggleModal={toggleModal}/>,document.body))}
    
  </>
  )
}

export default AddModal