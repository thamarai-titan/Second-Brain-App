import { addIcon } from "./assets/addIcon"
import { Buttons } from "./Components/Buttons"
import { Card } from "./Components/Card"

const App = ()=>{
  return <>
    <Buttons variant="primary" text="Add Content" startIcon={addIcon()}></Buttons>
    <Card/>
  </>
}
export default App