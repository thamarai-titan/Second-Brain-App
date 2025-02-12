import { ReactElement } from "react";

interface ButtonProps{
    variant: "primary" | "secondary";
    text:string;
    startIcon:ReactElement;

}
const variantClasses = {
    "primary": "bg-gray-300 p-3",
    "secondary":""
}

const defaultStyles = "p-3 rounded-sm flex items-center "
export function Buttons({variant,text,startIcon}: ButtonProps){
    return <button className={variantClasses[variant] + " " + defaultStyles}>
        <div className="pr-2">
        {startIcon}
        </div>
         {text}
    </button>
}