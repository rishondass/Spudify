type Props={
  value: string | number | undefined;
  label: string;
  onInputChange?: (id:string,value:string)=>void;
}

const MetadataInput = ({label, value, onInputChange}:Props) => {
  
  return (
    <div className="flex flex-col">
              <label>{label}</label>
              <input type="text" className="bg-transparent outline-none border border-gray-700 p-2 rounded-md focus:outline-green-400 focus:outline-1 focus:border-none focus:outline-offset-0" defaultValue={value} onChange={(e)=>{onInputChange&&onInputChange(label,e.target.value)}}/>
    </div>
  )
}

export default MetadataInput