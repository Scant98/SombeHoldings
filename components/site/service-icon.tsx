import {
  ClipboardListIcon,
  DoorOpenIcon,
  HardHatIcon,
  TruckIcon,
  WarehouseIcon,
  WrenchIcon,
} from "lucide-react"

const icons = {
  HardHat: HardHatIcon,
  Truck: TruckIcon,
  DoorOpen: DoorOpenIcon,
  ClipboardList: ClipboardListIcon,
  Warehouse: WarehouseIcon,
  Wrench: WrenchIcon,
} as const

export function ServiceIcon({
  name,
  className,
}: {
  name: keyof typeof icons
  className?: string
}) {
  const Icon = icons[name]
  return <Icon className={className} />
}
