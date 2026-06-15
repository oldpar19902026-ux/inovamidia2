import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  AlertCircle,
  CalendarIcon,
  Check,
  Clock,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { motion, type Variants } from "framer-motion";

/* ---------- Constantes de animação ---------- */
const easeEnter = [0.23, 1, 0.32, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeEnter },
  },
};

/* ---------- Componentes decorativos ---------- */
function GlowOrb({
  color,
  position,
  size,
  opacity = 0.12,
}: {
  color: string;
  position: string;
  size: string;
  opacity?: number;
}) {
  return (
    <motion.div
      className={`absolute ${position} ${size} rounded-full blur-[120px]`}
      style={{ background: color, opacity }}
      animate={{
        scale: [1, 1.08, 1],
        opacity: [opacity, opacity * 1.3, opacity],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function GridPattern() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)",
      }}
    />
  );
}

function ShimmerBorder() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  );
}

/* ---------- Card wrapper corporativo ---------- */
function CorporateCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-[#060B16] border border-white/[0.05] hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/60 rounded-2xl ${className}`}
    >
      <ShimmerBorder />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-purple-600/0 group-hover:from-violet-500/[0.02] group-hover:to-purple-600/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />
      {children}
    </div>
  );
}

export default function ComponentsShowcase() {
  const { theme, toggleTheme } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [datePickerDate, setDatePickerDate] = useState<Date>();
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [progress, setProgress] = useState(33);
  const [currentPage, setCurrentPage] = useState(2);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dialogInput, setDialogInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // AI ChatBox demo state
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Garante tema escuro para o visual corporativo
  useEffect(() => {
  if (theme === "light") toggleTheme?.();
}, []);

  const handleDialogSubmit = () => {
    console.log("Dialog submitted with value:", dialogInput);
    sonnerToast.success("Submitted successfully", {
      description: `Input: ${dialogInput}`,
    });
    setDialogInput("");
    setDialogOpen(false);
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleDialogSubmit();
    }
  };

  const handleChatSend = (content: string) => {
    // Add user message
    const newMessages: Message[] = [...chatMessages, { role: "user", content }];
    setChatMessages(newMessages);

    // Simulate AI response with delay
    setIsChatLoading(true);
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `This is a **demo response**. In a real app, you would call a tRPC mutation here:\n\n\`\`\`typescript\nconst chatMutation = trpc.ai.chat.useMutation({\n  onSuccess: (response) => {\n    setChatMessages(prev => [...prev, {\n      role: "assistant",\n      content: response.choices[0].message.content\n    }]);\n  }\n});\n\nchatMutation.mutate({ messages: newMessages });\n\`\`\`\n\nYour message was: "${content}"`,
      };
      setChatMessages([...newMessages, aiResponse]);
      setIsChatLoading(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#03060D] overflow-x-hidden selection:bg-violet-500/25 selection:text-white">
      {/* Camada de fundo decorativa */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridPattern />
        <GlowOrb
          color="#7c3aed"
          position="top-[-10%] left-[-5%]"
          size="w-[700px] h-[700px]"
          opacity={0.1}
        />
        <GlowOrb
          color="#059669"
          position="bottom-[-8%] right-[-4%]"
          size="w-[550px] h-[550px]"
          opacity={0.09}
        />
        <GlowOrb
          color="#3b82f6"
          position="top-[40%] left-[35%]"
          size="w-[400px] h-[400px]"
          opacity={0.06}
        />
      </div>

      {/* Header corporativo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeEnter }}
        className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#03060D]/80 backdrop-blur-3xl"
      >
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 ring-1 ring-white/10">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Inova Mídia
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.15em] uppercase">
                Component Library
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-white/[0.08] bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all rounded-lg"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.header>

      <main className="container max-w-6xl mx-auto px-5 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Text Colors Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Text Colors</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Foreground (Default)</p>
                      <p className="text-white text-lg">
                        Default text color for main content
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Muted Foreground</p>
                      <p className="text-gray-400 text-lg">
                        Muted text for secondary information
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Primary</p>
                      <p className="text-primary text-lg font-medium">
                        Primary brand color text
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Secondary Foreground</p>
                      <p className="text-secondary-foreground text-lg">
                        Secondary action text color
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Accent Foreground</p>
                      <p className="text-accent-foreground text-lg">
                        Accent text for emphasis
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Destructive</p>
                      <p className="text-destructive text-lg font-medium">
                        Error or destructive action text
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Card Foreground</p>
                      <p className="text-card-foreground text-lg">
                        Text color on card backgrounds
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Popover Foreground</p>
                      <p className="text-popover-foreground text-lg">
                        Text color in popovers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Color Combinations Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Color Combinations</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-primary text-primary-foreground rounded-lg p-4">
                    <p className="font-medium mb-1">Primary</p>
                    <p className="text-sm opacity-90">Primary background with foreground text</p>
                  </div>
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
                    <p className="font-medium mb-1">Secondary</p>
                    <p className="text-sm opacity-90">Secondary background with foreground text</p>
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg p-4">
                    <p className="font-medium mb-1">Muted</p>
                    <p className="text-sm opacity-90">Muted background with foreground text</p>
                  </div>
                  <div className="bg-accent text-accent-foreground rounded-lg p-4">
                    <p className="font-medium mb-1">Accent</p>
                    <p className="text-sm opacity-90">Accent background with foreground text</p>
                  </div>
                  <div className="bg-destructive text-destructive-foreground rounded-lg p-4">
                    <p className="font-medium mb-1">Destructive</p>
                    <p className="text-sm opacity-90">Destructive background with foreground text</p>
                  </div>
                  <div className="bg-card text-card-foreground rounded-lg p-4 border border-white/[0.05]">
                    <p className="font-medium mb-1">Card</p>
                    <p className="text-sm opacity-90">Card background with foreground text</p>
                  </div>
                  <div className="bg-popover text-popover-foreground rounded-lg p-4 border border-white/[0.05]">
                    <p className="font-medium mb-1">Popover</p>
                    <p className="text-sm opacity-90">Popover background with foreground text</p>
                  </div>
                  <div className="bg-background text-white rounded-lg p-4 border border-white/[0.05]">
                    <p className="font-medium mb-1">Background</p>
                    <p className="text-sm opacity-90">Default background with foreground text</p>
                  </div>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Buttons Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Buttons</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Form Inputs Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Form Inputs</h3>
            <CorporateCard>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here." />
                </div>
                <div className="space-y-2">
                  <Label>Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                <div className="space-y-2">
                  <Label>Radio Group</Label>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Option One</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Slider</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Input OTP</Label>
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="space-y-2">
                  <Label>Date Time Picker</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !datePickerDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePickerDate ? (
                          format(datePickerDate, "PPP HH:mm", { locale: zhCN })
                        ) : (
                          <span>Select date and time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 space-y-3">
                        <Calendar
                          mode="single"
                          selected={datePickerDate}
                          onSelect={setDatePickerDate}
                        />
                        <div className="border-t pt-3 space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Time
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              value={
                                datePickerDate
                                  ? format(datePickerDate, "HH:mm")
                                  : "00:00"
                              }
                              onChange={e => {
                                const [hours, minutes] = e.target.value.split(":");
                                const newDate = datePickerDate ? new Date(datePickerDate) : new Date();
                                newDate.setHours(parseInt(hours));
                                newDate.setMinutes(parseInt(minutes));
                                setDatePickerDate(newDate);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {datePickerDate && (
                    <p className="text-sm text-gray-400">
                      Selected:{" "}
                      {format(datePickerDate, "yyyy/MM/dd  HH:mm", { locale: zhCN })}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Searchable Dropdown</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {selectedFramework
                          ? [
                              { value: "react", label: "React" },
                              { value: "vue", label: "Vue" },
                              { value: "angular", label: "Angular" },
                              { value: "svelte", label: "Svelte" },
                              { value: "nextjs", label: "Next.js" },
                              { value: "nuxt", label: "Nuxt" },
                              { value: "remix", label: "Remix" },
                            ].find(fw => fw.value === selectedFramework)?.label
                          : "Select framework..."}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search frameworks..." />
                        <CommandList>
                          <CommandEmpty>No framework found</CommandEmpty>
                          <CommandGroup>
                            {[
                              { value: "react", label: "React" },
                              { value: "vue", label: "Vue" },
                              { value: "angular", label: "Angular" },
                              { value: "svelte", label: "Svelte" },
                              { value: "nextjs", label: "Next.js" },
                              { value: "nuxt", label: "Nuxt" },
                              { value: "remix", label: "Remix" },
                            ].map(framework => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={currentValue => {
                                  setSelectedFramework(
                                    currentValue === selectedFramework ? "" : currentValue
                                  );
                                  setOpenCombobox(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectedFramework === framework.value ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedFramework && (
                    <p className="text-sm text-gray-400">
                      Selected:{" "}
                      {[
                        { value: "react", label: "React" },
                        { value: "vue", label: "Vue" },
                        { value: "angular", label: "Angular" },
                        { value: "svelte", label: "Svelte" },
                        { value: "nextjs", label: "Next.js" },
                        { value: "nuxt", label: "Nuxt" },
                        { value: "remix", label: "Remix" },
                      ].find(fw => fw.value === selectedFramework)?.label}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="month" className="text-sm font-medium">Month</Label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger id="month">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {selectedMonth && selectedYear && (
                    <p className="text-sm text-gray-400">
                      Selected: {selectedYear}/{selectedMonth}/
                    </p>
                  )}
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Data Display Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Data Display</h3>
            <CorporateCard>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Badges</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Progress</Label>
                  <Progress value={progress} className="bg-white/[0.05]" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                  </div>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Skeleton</Label>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Pagination</Label>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={e => { e.preventDefault(); setCurrentPage(Math.max(1, currentPage - 1)); }}
                        />
                      </PaginationItem>
                      {[1, 2, 3, 4, 5].map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={e => { e.preventDefault(); setCurrentPage(page); }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={e => { e.preventDefault(); setCurrentPage(Math.min(5, currentPage + 1)); }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <p className="text-sm text-gray-400 text-center">Current page: {currentPage}</p>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Table</Label>
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow className="border-white/[0.04]">
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-white/[0.04]">
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow className="border-white/[0.04]">
                        <TableCell className="font-medium">INV002</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>
                      <TableRow className="border-white/[0.04]">
                        <TableCell className="font-medium">INV003</TableCell>
                        <TableCell>Unpaid</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell className="text-right">$350.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Menubar</Label>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>File</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>New Tab</MenubarItem>
                        <MenubarItem>New Window</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Share</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Print</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>Edit</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Undo</MenubarItem>
                        <MenubarItem>Redo</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>View</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Reload</MenubarItem>
                        <MenubarItem>Force Reload</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Breadcrumb</Label>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Alerts Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Alerts</h3>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Tabs</h3>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#060B16] border border-white/[0.05] rounded-xl p-1">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <CorporateCard className="mt-4">
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Make changes to your account here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Pedro Duarte" />
                    </div>
                  </CardContent>
                  <CardFooter><Button>Save changes</Button></CardFooter>
                </CorporateCard>
              </TabsContent>
              <TabsContent value="password">
                <CorporateCard className="mt-4">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter><Button>Save password</Button></CardFooter>
                </CorporateCard>
              </TabsContent>
              <TabsContent value="settings">
                <CorporateCard className="mt-4">
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your settings here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">Settings content goes here.</p>
                  </CardContent>
                </CorporateCard>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Accordion Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Accordion</h3>
            <CorporateCard>
              <div className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>Yes. It comes with default styles that matches the other components' aesthetic.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Collapsible Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Collapsible</h3>
            <CorporateCard>
              <Collapsible>
                <CardHeader>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/[0.05]">
                      <CardTitle>@peduarte starred 3 repositories</CardTitle>
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="rounded-md border border-white/[0.08] px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
                      <div className="rounded-md border border-white/[0.08] px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
                      <div className="rounded-md border border-white/[0.08] px-4 py-3 font-mono text-sm">@stitches/react</div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CorporateCard>
          </motion.section>

          {/* Overlays Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Overlays</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild><Button variant="outline">Open Dialog</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Test Input</DialogTitle>
                        <DialogDescription>Enter some text below. Press Enter to submit (IME composition supported).</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="dialog-input">Input</Label>
                          <Input
                            id="dialog-input"
                            placeholder="Type something..."
                            value={dialogInput}
                            onChange={(e) => setDialogInput(e.target.value)}
                            onKeyDown={handleDialogKeyDown}
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDialogSubmit}>Submit</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild><Button variant="outline">Open Sheet</Button></SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>Make changes to your profile here.</SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>

                  <Drawer>
                    <DrawerTrigger asChild><Button variant="outline">Open Drawer</Button></DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline">Open Popover</Button></PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Dimensions</h4>
                        <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
                    <TooltipContent><p>Add to library</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Menus Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Menus</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline">Dropdown Menu</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ContextMenu>
                    <ContextMenuTrigger asChild><Button variant="outline">Right Click Me</Button></ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Profile</ContextMenuItem>
                      <ContextMenuItem>Billing</ContextMenuItem>
                      <ContextMenuItem>Team</ContextMenuItem>
                      <ContextMenuItem>Subscription</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>

                  <HoverCard>
                    <HoverCardTrigger asChild><Button variant="outline">Hover Card</Button></HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">@nextjs</h4>
                        <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Calendar Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Calendar</h3>
            <CorporateCard>
              <div className="p-6 flex justify-center">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-white/[0.08]" />
              </div>
            </CorporateCard>
          </motion.section>

          {/* Carousel Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Carousel</h3>
            <CorporateCard>
              <div className="p-6">
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <span className="text-4xl font-semibold">{index + 1}</span>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Toggle Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Toggle</h3>
            <CorporateCard>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Toggle</Label>
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle italic"><span className="font-bold">B</span></Toggle>
                    <Toggle aria-label="Toggle italic"><span className="italic">I</span></Toggle>
                    <Toggle aria-label="Toggle underline"><span className="underline">U</span></Toggle>
                  </div>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Toggle Group</Label>
                  <ToggleGroup type="multiple">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold"><span className="font-bold">B</span></ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic"><span className="italic">I</span></ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Toggle underline"><span className="underline">U</span></ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Layout Components Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Layout Components</h3>
            <CorporateCard>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Aspect Ratio (16/9)</Label>
                  <AspectRatio ratio={16 / 9} className="bg-white/[0.03] rounded-lg overflow-hidden">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-400">16:9 Aspect Ratio</p>
                    </div>
                  </AspectRatio>
                </div>
                <Separator className="bg-white/[0.04]" />
                <div className="space-y-2">
                  <Label>Scroll Area</Label>
                  <ScrollArea className="h-[200px] w-full rounded-md border border-white/[0.08] overflow-hidden">
                    <div className="p-4">
                      <div className="space-y-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="text-sm text-gray-400">Item {i + 1}: This is a scrollable content area</div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Resizable Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Resizable Panels</h3>
            <CorporateCard>
              <div className="p-6">
                <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border border-white/[0.08]">
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Panel One</span>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Panel Two</span>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </CorporateCard>
          </motion.section>

          {/* Toast Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">Toast</h3>
            <CorporateCard>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Sonner Toast</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => sonnerToast.success("Operation successful", { description: "Your changes have been saved" })}>Success</Button>
                    <Button variant="outline" onClick={() => sonnerToast.error("Operation failed", { description: "Cannot complete operation" })}>Error</Button>
                    <Button variant="outline" onClick={() => sonnerToast.info("Information", { description: "This is an information message" })}>Info</Button>
                    <Button variant="outline" onClick={() => sonnerToast.warning("Warning", { description: "Please note the impact" })}>Warning</Button>
                    <Button variant="outline" onClick={() => sonnerToast.loading("Loading", { description: "Please wait" })}>Loading</Button>
                    <Button variant="outline" onClick={() => {
                      const promise = new Promise(resolve => setTimeout(resolve, 2000));
                      sonnerToast.promise(promise, { loading: "Processing...", success: "Processing complete!", error: "Processing failed" });
                    }}>Promise</Button>
                  </div>
                </div>
              </div>
            </CorporateCard>
          </motion.section>

          {/* AI ChatBox Section */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-white mb-4">AI ChatBox</h3>
            <CorporateCard>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">
                    <p>A ready-to-use chat interface component that integrates with the LLM system. Features markdown rendering, auto-scrolling, and loading states.</p>
                    <p className="mt-2">This is a demo with simulated responses. In a real app, you'd connect it to a tRPC mutation.</p>
                  </div>
                  <AIChatBox
                    messages={chatMessages}
                    onSendMessage={handleChatSend}
                    isLoading={isChatLoading}
                    placeholder="Try sending a message..."
                    height="500px"
                    emptyStateMessage="How can I help you today?"
                    suggestedPrompts={[
                      "What is React?",
                      "Explain TypeScript",
                      "How to use tRPC?",
                      "Best practices for web development",
                    ]}
                  />
                </div>
              </div>
            </CorporateCard>
          </motion.section>
        </motion.div>
      </main>

      <footer className="border-t border-white/[0.04] py-8 mt-12">
        <div className="container text-center text-sm text-gray-500">
          <p>Inova Mídia Component Library &middot; Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}