import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custom-tabs"
import { SlotClassList } from "./slotClasslist"
import { classesData, type ClassListView } from "../classData" // Import cả data và type

const slot1Classes = classesData.filter((classItem: ClassListView) =>
  classItem.class.class_id === 1
)
const slot2Classes = classesData.filter((classItem: ClassListView) =>
  classItem.class.class_id === 2
)
const slot3Classes = classesData.filter((classItem: ClassListView) =>
  classItem.class.class_id === 3
)

const ClassList = () => {
  return (
    <div>
      <Tabs defaultValue="Slot1" className="w-full">
        <TabsList>
          <TabsTrigger className="!shadow-none" value="Slot1">
            Slot 1 
          </TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Slot2">
            Slot 2 
          </TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Slot3">
            Slot 3 
          </TabsTrigger>
        </TabsList>
        <TabsContent className="-mt-1" value="Slot1">
          <SlotClassList classes={slot1Classes} />
        </TabsContent>
        <TabsContent className="-mt-1" value="Slot2">
          <SlotClassList classes={slot2Classes} />
        </TabsContent>
        <TabsContent className="-mt-1" value="Slot3">
          <SlotClassList classes={slot3Classes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClassList