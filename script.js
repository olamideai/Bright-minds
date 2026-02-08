/**************************************************
 * TASFUED QUIZ APP – SINGLE SCRIPT.JS (v2.0)
 * Pure Vanilla JavaScript
 **************************************************/

/* ===============================
   1. GLOBAL VARIABLES & STATE
================================ */
let studentName = "";
let currentSubject = "";
let questions = [];
let currentIndex = 0;
let answers = {}; // { index: "A" }
let timer = null;
let timeLeft = 0;
let quizCompleted = false;

/* ===============================
   2. QUESTION DATA (SAMPLE)
   👉 You can add more subjects
================================ */
const QUESTION_BANK = {




  "PHY 107.pdf": [
    {
      "q": "A simple pendulum makes X oscillations in one minute. Determine X if its period of oscillation is 1.20 s.",
      "o": {
        "A": "50",
        "B": "60",
        "C": "40",
        "D": "30"
      },
      "a": "A"
    },
    {
      "q": "The density of a block is 150 gcm-3 and has a mass of 80 g. Calculate the volume of the block.",
      "o": {
        "A": "0.53 cm3",
        "B": "0.48 cm3",
        "C": "1.87 cm3",
        "D": "0.60 cm3"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is the unit of force?",
      "o": {
        "A": "W",
        "B": "J",
        "C": "N",
        "D": "Ns"
      },
      "a": "C"
    },
    {
      "q": "The graph showing the variation in the angle of deviation of light through prism with the angle of incidence is",
      "o": {
        "A": "a straight line",
        "B": "a curve",
        "C": "a parabola",
        "D": "a hyperbola"
      },
      "a": "B"
    },
    {
      "q": "Which of the following graphs will give us more information?",
      "o": {
        "A": "linear graph",
        "B": "Non-linear graph",
        "C": "assotopic graph",
        "D": "quadratic graph"
      },
      "a": "B"
    },
    {
      "q": "What type of relationship exists between A and B if the increase in the value A brings a decrease in the value of B?",
      "o": {
        "A": "direct",
        "B": "inverse",
        "C": "quadratic",
        "D": "geometric"
      },
      "a": "B"
    },
    {
      "q": "The dependent variable in the equation F = ke is ….",
      "o": {
        "A": "F",
        "B": "k",
        "C": "e",
        "D": "none of the above"
      },
      "a": "A"
    },
    {
      "q": "The point where the line of best fit touches the vertical axis is called",
      "o": {
        "A": "origin",
        "B": "intercept",
        "C": "vertex",
        "D": "slope"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is not an essential component of a graph?",
      "o": {
        "A": "Title",
        "B": "Coordinate axes",
        "C": "Scales",
        "D": "None of the above"
      },
      "a": "D"
    },
    {
      "q": "The slope of the graph obtained in a simple pendulum experiment when a graph of l is plotted against T squared is 0.25 ms-2. Determine the value of g.",
      "o": {
        "A": "9.8 ms-2",
        "B": "10.0 ms-2",
        "C": "8.5 ms-2",
        "D": "7.5 ms-2"
      },
      "a": "A"
    },
    {
      "q": "In a simple pendulum experiment, the value of T _________ as the value of l increases.",
      "o": {
        "A": "decreases",
        "B": "increases",
        "C": "remains constant",
        "D": "increases and later decreases"
      },
      "a": "B"
    },
    {
      "q": "A simple pendulum makes 50 oscillations in one minute. Determine its period of oscillation.",
      "o": {
        "A": "1.2 s",
        "B": "1.0 s",
        "C": "2.0 s",
        "D": "1.5 s"
      },
      "a": "A"
    },
    {
      "q": "The period of oscillation of a simple pendulum is 2 s when the length of the string is 64 cm. Calculate the period if the string’s length is shortened to 49 cm.",
      "o": {
        "A": "1.75 s",
        "B": "1.55 s",
        "C": "1.96 s",
        "D": "1.25 s"
      },
      "a": "A"
    },
    {
      "q": "A force of 10 N produced an extension of 2.50 cm. Determine the spring constant.",
      "o": {
        "A": "400 N/m",
        "B": "250 N/m",
        "C": "350 N/m",
        "D": "500 N/m"
      },
      "a": "A"
    },
    {
      "q": "In Hooke’s law experiment, a graph of the extension e was plotted against Force F. If the slope of the graph is 0.4 mN-1, what is the value of k?",
      "o": {
        "A": "2.5 N/m",
        "B": "0.4 N/m",
        "C": "4.0 N/m",
        "D": "25 N/m"
      },
      "a": "A"
    },
    {
      "q": "The energy stored in a spring of stiffness constant k = 2000 N/m when extended by 4 cm is",
      "o": {
        "A": "1.6 J",
        "B": "0.16 J",
        "C": "16 J",
        "D": "0.016 J"
      },
      "a": "B"
    },
    {
      "q": "Which of the following affect the period of a simple pendulum?",
      "o": {
        "A": "length of string",
        "B": "mass of the bob",
        "C": "acceleration due to gravity",
        "D": "None of the above"
      },
      "a": "A"
    },
    {
      "q": "The frequency of a certain pendulum A is 10 cycles per second, and the frequency of another pendulum B is 5 cycles per second. Which pendulum is longer in length?",
      "o": {
        "A": "A",
        "B": "B",
        "C": "both are equal in length",
        "D": "A is slightly longer than B"
      },
      "a": "B"
    },
    {
      "q": "The period of Oscillation can be defined as",
      "o": {
        "A": "The time for one complete oscillation",
        "B": "The time taken to complete half an oscillation",
        "C": "The number of oscillations per second",
        "D": "The maximum displacement from rest"
      },
      "a": "A"
    },
    {
      "q": "The main reading of a Vernier calliper 6.2 cm. If the main scale and the vernier scale coincides at the 7th position. What is the total reading of the instrument?",
      "o": {
        "A": "6.27 cm",
        "B": "6.17 cm",
        "C": "6.70 cm",
        "D": "6.07 cm"
      },
      "a": "A"
    },
    {
      "q": "The diameter of a piece of wire can be most accurate when measured with a",
      "o": {
        "A": "Vernier caliper",
        "B": "Micrometer screw gauge",
        "C": "Meter rule",
        "D": "Measuring tape"
      },
      "a": "B"
    },
    {
      "q": "Which of the following represent the correct precision if the length of a piece of wire is measured with a metre rule?",
      "o": {
        "A": "35 mm",
        "B": "35.0 mm",
        "C": "35.00 mm",
        "D": "35.01 mm"
      },
      "a": "A"
    },
    {
      "q": "The smallest scale division of a Vernier caliper is",
      "o": {
        "A": "0.1 mm",
        "B": "0.02 mm",
        "C": "0.5 mm",
        "D": "1 mm"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is not a part of the micrometer screw gauge?",
      "o": {
        "A": "Anvil",
        "B": "Spindle",
        "C": "None",
        "D": "Thimber"
      },
      "a": "D"
    },
    {
      "q": "The clenched jaws of the anvil and the spindle are brought into contact through",
      "o": {
        "A": "sleeve",
        "B": "rachet",
        "C": "anvil",
        "D": "spindle"
      },
      "a": "B"
    },
    {
      "q": "A simple pendulum 0.64 m long has a period of 1.2 s. calculate the period of a similar pendulum 0.36 m long in the same location.",
      "o": {
        "A": "0.9 s",
        "B": "0.85 s",
        "C": "0.95 s",
        "D": "1.0 s"
      },
      "a": "A"
    },
    {
      "q": "An error due to inherent defects in the method or apparatus used is called",
      "o": {
        "A": "Random error",
        "B": "Systematic error",
        "C": "Personal error",
        "D": "Human error"
      },
      "a": "B"
    },
    {
      "q": "Errors due to personal peculiarities of an observer where human reaction to an event or estimation affects the results are called",
      "o": {
        "A": "Random errors",
        "B": "Systematic errors",
        "C": "Personal errors",
        "D": "Instrumental errors"
      },
      "a": "C"
    },
    {
      "q": "The only way to eliminate systematic errors is to…….",
      "o": {
        "A": "repeat the experiment",
        "B": "use a different method or apparatus",
        "C": "average the results",
        "D": "ignore the errors"
      },
      "a": "B"
    },
    {
      "q": "The only remedy to random errors is to …….",
      "o": {
        "A": "ignore them",
        "B": "use better apparatus",
        "C": "take repeated measurements and average them",
        "D": "change the experiment"
      },
      "a": "C"
    },
    {
      "q": "The errors due to the accuracy of the division of graduated scales on the instrument is called",
      "o": {
        "A": "Parallax error",
        "B": "Systematic error",
        "C": "Zero error",
        "D": "Instrumental error"
      },
      "a": "D"
    },
    {
      "q": "Errors due to unknown causes or chance are known as",
      "o": {
        "A": "Random errors",
        "B": "Systematic errors",
        "C": "Personal errors",
        "D": "Human errors"
      },
      "a": "A"
    },
    {
      "q": "Experimental errors are usually divided into two main types which are",
      "o": {
        "A": "Random and systematic errors",
        "B": "Personal and instrumental errors",
        "C": "Human and mechanical errors",
        "D": "Zero and parallax errors"
      },
      "a": "A"
    },
    {
      "q": "At a glance, _____ gives a comprehensive picture of the experiment than the data themselves.",
      "o": {
        "A": "a device",
        "B": "a curve",
        "C": "a line",
        "D": "a graph"
      },
      "a": "D"
    },
    {
      "q": "The general form of the equation which yields a straight line is",
      "o": {
        "A": "y = mx2 + c",
        "B": "xy = mc",
        "C": "y = mx + c",
        "D": "xy = m2 + c"
      },
      "a": "C"
    },
    {
      "q": "The S.I. unit of spring constant is",
      "o": {
        "A": "Newton",
        "B": "Newton per meter",
        "C": "Joule",
        "D": "Pascal"
      },
      "a": "B"
    },
    {
      "q": "To get the elongation e in Hooke’s experiment of elasticity, where L1 is the initial length and L2 is the new length. The equation is ..",
      "o": {
        "A": "e = L2 - L1",
        "B": "e = L1 + L2",
        "C": "e = L2 / L1",
        "D": "e = L1 - L2"
      },
      "a": "A"
    },
    {
      "q": "The change in velocity of a body at a particular time is known as",
      "o": {
        "A": "Instantaneous velocity",
        "B": "Instantaneous speed",
        "C": "Instantaneous acceleration",
        "D": "Free-fall motion"
      },
      "a": "C"
    },
    {
      "q": "If two vectors are represented thus: A = 5i + 2j + k and B = 2i + 4j - 3k. Find A • B.",
      "o": {
        "A": "13",
        "B": "15",
        "C": "17",
        "D": "-13"
      },
      "a": "B"
    },
    {
      "q": "An object of mass 50 Kg is projected with a velocity of 20 ms-1 at an angle of 60 degrees to the horizontal. Calculate the time of flight.",
      "o": {
        "A": "3.46 s",
        "B": "2.0 s",
        "C": "1.73 s",
        "D": "1.0 s"
      },
      "a": "A"
    },
    {
      "q": "_____ is defined as the process used to check the validity of a specific equation in mechanics.",
      "o": {
        "A": "Uncertainty",
        "B": "Dimensional analysis",
        "C": "Motion analysis",
        "D": "Newton’s equations of motion"
      },
      "a": "B"
    },
    {
      "q": "The independent variable in the equation F = ke is ….",
      "o": {
        "A": "F",
        "B": "k",
        "C": "e",
        "D": "none of the above"
      },
      "a": "C"
    },

   
  {
    "q": "The electricity meters in houses measure energy units consumed in……",
    "o": {
      "A": "Volts",
      "B": "Amperes",
      "C": "Watts",
      "D": "Kilowatt-hours"
    },
    "a": "D"
  },
  {
    "q": "The tendency of a stationary body to continue to remain at rest when a force is applied to it is known as",
    "o": {
      "A": "Inertia",
      "B": "Momentum",
      "C": "Friction",
      "D": "Acceleration"
    },
    "a": "A"
  },
  {
    "q": "Which of the following quantities has the same unit as energy?",
    "o": {
      "A": "Power",
      "B": "Work",
      "C": "Force",
      "D": "Impulse"
    },
    "a": "B"
  },
  {
    "q": "Which of the following is not an example of force?",
    "o": {
      "A": "Tension",
      "B": "Weight",
      "C": "Mass",
      "D": "Friction"
    },
    "a": "C"
  },
  {
    "q": "Which of the following is not a conductor of electricity?",
    "o": {
      "A": "Human body",
      "B": "Silver",
      "C": "Glass",
      "D": "Copper"
    },
    "a": "C"
  },
  {
    "q": "A chemical balance is used for measuring",
    "o": {
      "A": "Mass",
      "B": "Volume",
      "C": "Density",
      "D": "Temperature"
    },
    "a": "A"
  },
  {
    "q": "When an elastic material is stretched by a force, the energy stored in it is",
    "o": {
      "A": "Kinetic energy",
      "B": "Potential energy",
      "C": "Elastic potential energy",
      "D": "Thermal energy"
    },
    "a": "C"
  },
  {
    "q": "Material that can be stretched and still return to the original form when the stresses are removed are said to be",
    "o": {
      "A": "Elastic",
      "B": "Plastic",
      "C": "Brittle",
      "D": "Ductile"
    },
    "a": "A"
  }


  ],
         

   
  "COS 101 (2)": [
    {
      "q": "Which is not a type of computer?",
      "o": {
        "A": "Supercomputer",
        "B": "Mainframe",
        "C": "Windows",
        "D": "Microcomputer"
      },
      "a": "C"
    },
    {
      "q": "What is a database?",
      "o": {
        "A": "A place to keep base stations",
        "B": "An organized collection of structured information or data",
        "C": "A type of keyboard",
        "D": "The computer's power supply"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of computer memory?",
      "o": {
        "A": "RAM",
        "B": "ROM",
        "C": "Monitor",
        "D": "Cache"
      },
      "a": "C"
    },
    {
      "q": "What is the function of an Ethernet card?",
      "o": {
        "A": "To play sound",
        "B": "To connect a computer to a wired network",
        "C": "To capture video",
        "D": "To store photos"
      },
      "a": "B"
    },
    {
      "q": "What is the purpose of a power supply unit?",
      "o": {
        "A": "To store data",
        "B": "To convert mains AC to low-voltage regulated DC power for the computer",
        "C": "To display the desktop",
        "D": "To cool the CPU"
      },
      "a": "B"
    },
    {
      "q": "A device used to control games is a?",
      "o": {
        "A": "Joystick/Gamepad",
        "B": "Scanner",
        "C": "Printer",
        "D": "Plotter"
      },
      "a": "A"
    },
    {
      "q": "A network switch is used to?",
      "o": {
        "A": "Turn the computer on/off",
        "B": "Connect multiple devices on a computer network",
        "C": "Change the wallpaper",
        "D": "Browse the web"
      },
      "a": "B"
    },
    {
      "q": "What is the purpose of virtual memory?",
      "o": {
        "A": "To make the monitor brighter",
        "B": "To use hardware space as \"extra\" RAM when physical RAM is full",
        "C": "To play virtual reality games",
        "D": "To store files in the cloud"
      },
      "a": "B"
    },
    {
      "q": "What device is used for internet connection?",
      "o": {
        "A": "Printer",
        "B": "Modem/Router",
        "C": "Scanner",
        "D": "Sound card"
      },
      "a": "B"
    },
    {
      "q": "A sound card is used to?",
      "o": {
        "A": "Store music files",
        "B": "Input and output audio signals to/from a computer",
        "C": "Increase the speed of the internet",
        "D": "Connect a mouse"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of monitor?",
      "o": {
        "A": "LED",
        "B": "CRT",
        "C": "UPS",
        "D": "LCD"
      },
      "a": "C"
    },
    {
      "q": "The use of backup is to?",
      "o": {
        "A": "Speed up the computer",
        "B": "Create a copy of data to recover it in case of loss",
        "C": "Delete old files",
        "D": "Update the OS"
      },
      "a": "B"
    },
    {
      "q": "Which is a type of computer file system?",
      "o": {
        "A": "NTFS / FAT32",
        "B": "HTML",
        "C": "MP3",
        "D": "JPEG"
      },
      "a": "A"
    },
    {
      "q": "What is the purpose of the taskbar?",
      "o": {
        "A": "To hide files",
        "B": "To launch and monitor running applications",
        "C": "To scan for viruses",
        "D": "To type text"
      },
      "a": "B"
    },
    {
      "q": "What is the purpose of the heat sink?",
      "o": {
        "A": "To store data",
        "B": "To dissipate heat away from the CPU",
        "C": "To provide power",
        "D": "To connect to the internet"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of computer user interface?",
      "o": {
        "A": "GUI",
        "B": "CLI",
        "C": "Apps",
        "D": "Voice Interface"
      },
      "a": "C"
    },
    {
      "q": "What is the purpose of the registry?",
      "o": {
        "A": "To list all users",
        "B": "A database that stores configuration settings for the OS and apps",
        "C": "To save documents",
        "D": "To print files"
      },
      "a": "B"
    },
    {
      "q": "A device used for short-range wireless connection is?",
      "o": {
        "A": "Ethernet",
        "B": "Bluetooth",
        "C": "Fiber Optic",
        "D": "Satellite"
      },
      "a": "B"
    },
    {
      "q": "What is the function of the CPU fan?",
      "o": {
        "A": "To blow dust onto the board",
        "B": "To keep the CPU cool by pulling hot air away",
        "C": "To speed up the hard drive",
        "D": "To make the computer louder"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of computer case?",
      "o": {
        "A": "Tower",
        "B": "Laptop",
        "C": "Server",
        "D": "Desktop"
      },
      "a": "C"
    },
    {
      "q": "Which device is not a type of input/output device?",
      "o": {
        "A": "Mouse",
        "B": "Monitor",
        "C": "CPU",
        "D": "Keyboard"
      },
      "a": "C"
    },
    {
      "q": "Which is a type of computer battery?",
      "o": {
        "A": "CMOS",
        "B": "RAM",
        "C": "SSD",
        "D": "ALU"
      },
      "a": "A"
    },
    {
      "q": "A device used for network protection is?",
      "o": {
        "A": "Router",
        "B": "Firewall",
        "C": "Switch",
        "D": "Hub"
      },
      "a": "B"
    },
    {
      "q": "The function of a RAID system is to?",
      "o": {
        "A": "Increase internet speed",
        "B": "Provide data redundancy and/or improve performance",
        "C": "Clean the registry",
        "D": "Connect to a printer"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of computer display RAM?",
      "o": {
        "A": "VRAM",
        "B": "DRAM",
        "C": "SRAM",
        "D": "SDRAM"
      },
      "a": "C"
    },
    {
      "q": "The purpose of system restore is to?",
      "o": {
        "A": "Delete all files",
        "B": "Roll back system files and settings to an earlier point in time",
        "C": "Reinstall the hardware",
        "D": "Upgrade the RAM"
      },
      "a": "B"
    },
    {
      "q": "Which is not a type of keyboard?",
      "o": {
        "A": "Mechanical",
        "B": "Membrane",
        "C": "Digital",
        "D": "Ergonomic"
      },
      "a": "C"
    },
    {
      "q": "What is the purpose of disk defragmentation?",
      "o": {
        "A": "To delete files",
        "B": "To reorganize files so they are stored in contiguous blocks to improve speed",
        "C": "To format the hard drive",
        "D": "To check for viruses"
      },
      "a": "B"
    },
    {
      "q": "What is a computer program?",
      "o": {
        "A": "A piece of hardware",
        "B": "A collection of instructions that performs a specific task when executed",
        "C": "The computer screen",
        "D": "A user manual"
      },
      "a": "B"
    },
    {
      "q": "A program used for software development is?",
      "o": {
        "A": "IDE (Integrated Development Environment)",
        "B": "Media Player",
        "C": "Browser",
        "D": "Spreadsheet"
      },
      "a": "A"
    },
    {
      "q": "Example of an interpreted language is?",
      "o": {
        "A": "C++",
        "B": "Python",
        "C": "Assembly",
        "D": "COBOL"
      },
      "a": "B"
    },
    {
      "q": "What is Firmware?",
      "o": {
        "A": "Permanent software programmed into a hardware device's read-only memory",
        "B": "A soft sponge for cleaning computers",
        "C": "A type of antivirus",
        "D": "An update for MS Word"
      },
      "a": "A"
    },
    {
      "q": "The purpose of an algorithm is to?",
      "o": {
        "A": "Provide a step-by-step procedure for solving a problem",
        "B": "Calculate taxes only",
        "C": "Store images",
        "D": "Connect to a server"
      },
      "a": "A"
    },
    {
      "q": "Example of cloud storage is?",
      "o": {
        "A": "Hard Drive",
        "B": "Google Drive",
        "C": "RAM",
        "D": "Floppy Disk"
      },
      "a": "B"
    },
    {
      "q": "Accumulation of dust in the cooling fan causes?",
      "o": {
        "A": "Increased speed",
        "B": "Overheating and potential system failure",
        "C": "Better performance",
        "D": "Less noise"
      },
      "a": "B"
    },
    {
      "q": "What is the full form of HTML?",
      "o": {
        "A": "Hypertext Markup Language",
        "B": "High Transfer Machine Language",
        "C": "Hyperlink Tool Management Line",
        "D": "Home Tool Markup Language"
      },
      "a": "A"
    },
    {
      "q": "What is an algorithm?",
      "o": {
        "A": "A mathematical formula only",
        "B": "A set of rules to be followed in calculations or problem-solving",
        "C": "A computer virus",
        "D": "A type of hardware"
      },
      "a": "B"
    },
    {
      "q": "What is the difference between a compiler and an interpreter?",
      "o": {
        "A": "Compilers are slower",
        "B": "Compilers translate the whole program at once, interpreters translate line-by-line",
        "C": "Interpreters are only for hardware",
        "D": "There is no difference"
      },
      "a": "B"
    },
    {
      "q": "What is the main function of the Arithmetic Logic Unit (ALU)?",
      "o": {
        "A": "To store data",
        "B": "To perform mathematical and logical comparisons",
        "C": "To control the mouse",
        "D": "To manage the internet"
      },
      "a": "B"
    },
    {
      "q": "What is a bus in a computer system?",
      "o": {
        "A": "A vehicle for transporting computers",
        "B": "A communication system that transfers data between components",
        "C": "A large storage unit",
        "D": "A type of power cable"
      },
      "a": "B"
    },
    {
      "q": "Which layer of the OSI Model is responsible for logical addressing (IP addresses)?",
      "o": {
        "A": "Physical Layer",
        "B": "Data Link Layer",
        "C": "Network Layer",
        "D": "Transport Layer"
      },
      "a": "C"
    },
    {
      "q": "What is the purpose of caching in a computer system?",
      "o": {
        "A": "To permanently store files",
        "B": "To store frequently accessed data for faster retrieval",
        "C": "To delete temporary files",
        "D": "To scan for errors"
      },
      "a": "B"
    },
    {
      "q": "What is data encapsulation in networking?",
      "o": {
        "A": "Deleting data",
        "B": "Adding headers/trailers to data as it moves down the OSI layers",
        "C": "Compressing files into a ZIP",
        "D": "Password protecting a folder"
      },
      "a": "B"
    },
    {
      "q": "What is the primary difference between Open Source and Proprietary software?",
      "o": {
        "A": "Open source is always free",
        "B": "Open source source code is available to the public; Proprietary code is hidden/owned",
        "C": "Proprietary software doesn't need an OS",
        "D": "Open source is only for Linux"
      },
      "a": "B"
    }
  ],
         

  "COS 101 (1)": [
    {
      "q": "What is a computer?",
      "o": {
        "A": "A mechanical tool for building houses",
        "B": "An electronic device that processes data into information",
        "C": "A storage unit only for physical files",
        "D": "A device that only plays videos"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is an input device?",
      "o": {
        "A": "Printer",
        "B": "Monitor",
        "C": "Keyboard",
        "D": "Speaker"
      },
      "a": "C"
    },
    {
      "q": "The basic operations performed by a computer are?",
      "o": {
        "A": "Arithmetic operations",
        "B": "Logical operations",
        "C": "Storage and retrieval",
        "D": "All of the above"
      },
      "a": "D"
    },
    {
      "q": "What does RAM stand for?",
      "o": {
        "A": "Read Access Memory",
        "B": "Random Access Memory",
        "C": "Real Analysis Memory",
        "D": "Remote Access Memory"
      },
      "a": "B"
    },
    {
      "q": "Which of these is a secondary memory?",
      "o": {
        "A": "RAM",
        "B": "Hard Disk",
        "C": "CPU",
        "D": "ROM"
      },
      "a": "B"
    },
    {
      "q": "The full form of CPU is?",
      "o": {
        "A": "Central Processing Unit",
        "B": "Control Processing Unit",
        "C": "Computer Power Unit",
        "D": "Central Programming Unit"
      },
      "a": "A"
    },
    {
      "q": "Which of these is an OS (Operating System)?",
      "o": {
        "A": "MS Word",
        "B": "Chrome",
        "C": "Games",
        "D": "Windows"
      },
      "a": "D"
    },
    {
      "q": "The smallest unit in a computer is?",
      "o": {
        "A": "Byte",
        "B": "Kilo",
        "C": "Bits",
        "D": "Megabyte"
      },
      "a": "C"
    },
    {
      "q": "Which device is used to convert a digital signal to information?",
      "o": {
        "A": "Modem",
        "B": "Keyboard",
        "C": "Mouse",
        "D": "CPU"
      },
      "a": "A"
    },
    {
      "q": "What is the primary use of an OS?",
      "o": {
        "A": "To make the computer look pretty",
        "B": "To manage hardware and software resources",
        "C": "To browse the internet only",
        "D": "To perform mathematical calculations"
      },
      "a": "B"
    },
    {
      "q": "Which of these is volatile?",
      "o": {
        "A": "Hard Disk",
        "B": "ROM",
        "C": "RAM",
        "D": "Hard Drive"
      },
      "a": "C"
    },
    {
      "q": "The work of the ALU is?",
      "o": {
        "A": "To store data",
        "B": "To perform arithmetic and logical operations",
        "C": "To control the power supply",
        "D": "To display images"
      },
      "a": "B"
    },
    {
      "q": "Which generation of computer uses a vacuum tube?",
      "o": {
        "A": "First Generation",
        "B": "Second Generation",
        "C": "Third Generation",
        "D": "Fourth Generation"
      },
      "a": "A"
    },
    {
      "q": "What type of software is Microsoft PowerPoint?",
      "o": {
        "A": "System Software",
        "B": "Application Software",
        "C": "Operating System",
        "D": "Utility Software"
      },
      "a": "B"
    },
    {
      "q": "Which port is used to connect a printer to the computer?",
      "o": {
        "A": "VGA Port",
        "B": "USB/Parallel Port",
        "C": "PS/2 Port",
        "D": "HDMI Port"
      },
      "a": "B"
    },
    {
      "q": "What is a pixel?",
      "o": {
        "A": "A computer part",
        "B": "The smallest controllable element of a picture on a screen",
        "C": "A type of storage",
        "D": "A programming language"
      },
      "a": "B"
    },
    {
      "q": "Which of these is not a web browser?",
      "o": {
        "A": "Chrome",
        "B": "Firefox",
        "C": "Photoshop",
        "D": "Safari"
      },
      "a": "C"
    },
    {
      "q": "What does URL stand for?",
      "o": {
        "A": "Uniform Resource Locator",
        "B": "United Resource Link",
        "C": "Universal Radio Label",
        "D": "Unit Resource Logic"
      },
      "a": "A"
    },
    {
      "q": "Which of this is an example of malware?",
      "o": {
        "A": "Virus",
        "B": "Firewall",
        "C": "Firefox",
        "D": "Antivirus"
      },
      "a": "A"
    },
    {
      "q": "What is a firewall?",
      "o": {
        "A": "A physical wall to protect the CPU",
        "B": "A security system that monitors and controls network traffic",
        "C": "A type of cooling fan",
        "D": "An antivirus software"
      },
      "a": "B"
    },
    {
      "q": "Which device is used for uninterrupted power supply?",
      "o": {
        "A": "CPU",
        "B": "UPS",
        "C": "ALU",
        "D": "RAM"
      },
      "a": "B"
    },
    {
      "q": "What is a high-level programming language?",
      "o": {
        "A": "Python",
        "B": "Windows",
        "C": "Java",
        "D": "Hard Drive"
      },
      "a": "A"
    },
    {
      "q": "The meaning of HTTP is?",
      "o": {
        "A": "Hyperlink Text Transfer Protocol",
        "B": "Hypertext Transfer Protocol",
        "C": "Hypertext Technical Program",
        "D": "High Transfer Text Protocol"
      },
      "a": "B"
    },
    {
      "q": "Which unit measure is used to measure the processing speed of the CPU?",
      "o": {
        "A": "MB/s",
        "B": "Gigahertz (GHz)",
        "C": "GB",
        "D": "DPI"
      },
      "a": "B"
    },
    {
      "q": "What is a computer application?",
      "o": {
        "A": "A piece of hardware",
        "B": "A program designed to perform a specific task for users",
        "C": "The computer case",
        "D": "A type of cable"
      },
      "a": "B"
    },
    {
      "q": "Which of these is not a type of printer?",
      "o": {
        "A": "LaserJet Printer",
        "B": "Plotter",
        "C": "Monitor",
        "D": "Inkjet Printer"
      },
      "a": "C"
    },
    {
      "q": "What is the purpose of the monitor?",
      "o": {
        "A": "To input data",
        "B": "To display visual information",
        "C": "To store files",
        "D": "To print documents"
      },
      "a": "B"
    },
    {
      "q": "Which device is used to generate input graphics?",
      "o": {
        "A": "Scanner",
        "B": "Printer",
        "C": "Mouse",
        "D": "Monitor"
      },
      "a": "A"
    },
    {
      "q": "What is the full form of PDF?",
      "o": {
        "A": "Personal Data File",
        "B": "Portable Document Format",
        "C": "Printable Digital File",
        "D": "Portable Data Function"
      },
      "a": "B"
    },
    {
      "q": "Which of these is a computer network?",
      "o": {
        "A": "TCP",
        "B": "LAN",
        "C": "USB",
        "D": "CPU"
      },
      "a": "B"
    },
    {
      "q": "What is the purpose of BIOS?",
      "o": {
        "A": "To edit photos",
        "B": "To initialize hardware during the booting process",
        "C": "To browse the web",
        "D": "To cool down the processor"
      },
      "a": "B"
    },
    {
      "q": "Which device is used to point and select?",
      "o": {
        "A": "Keyboard",
        "B": "Mouse",
        "C": "Monitor",
        "D": "Speaker"
      },
      "a": "B"
    },
    {
      "q": "A folder is used to store files. Which of these is not a valid file extension?",
      "o": {
        "A": ".exe",
        "B": ".doc",
        "C": ".cpu",
        "D": ".txt"
      },
      "a": "C"
    },
    {
      "q": "What is the function of the motherboard?",
      "o": {
        "A": "To provide power to the monitor",
        "B": "To serve as the main circuit board connecting all components",
        "C": "To store the operating system permanently",
        "D": "To print documents"
      },
      "a": "B"
    },
    {
      "q": "Which is a search engine?",
      "o": {
        "A": "Google",
        "B": "AOL",
        "C": "Microsoft",
        "D": "All of the above"
      },
      "a": "A"
    },
    {
      "q": "The purpose of a server is?",
      "o": {
        "A": "To play games",
        "B": "To provide data or services to other computers in a network",
        "C": "To act as a mouse",
        "D": "To increase typing speed"
      },
      "a": "B"
    },
    {
      "q": "A device that enables online chat is a?",
      "o": {
        "A": "Webcam/Microphone",
        "B": "Printer",
        "C": "Scanner",
        "D": "Hard Drive"
      },
      "a": "A"
    },
    {
      "q": "The function of an IP address is?",
      "o": {
        "A": "To store passwords",
        "B": "To uniquely identify a device on a network",
        "C": "To speed up the internet",
        "D": "To name a folder"
      },
      "a": "B"
    },
    {
      "q": "The purpose of a compiler is?",
      "o": {
        "A": "To write emails",
        "B": "To translate high-level code into machine code",
        "C": "To delete viruses",
        "D": "To connect to the internet"
      },
      "a": "B"
    },
    {
      "q": "The function of ROM is?",
      "o": {
        "A": "To store temporary data",
        "B": "To store permanent start-up instructions (Firmware)",
        "C": "To display graphics",
        "D": "To provide internet access"
      },
      "a": "B"
    },
    {
      "q": "What generation of computer uses an integrated circuit?",
      "o": {
        "A": "First",
        "B": "Second",
        "C": "Third",
        "D": "Fourth"
      },
      "a": "C"
    },
    {
      "q": "What is Cloud Computing?",
      "o": {
        "A": "Computing done in the sky",
        "B": "Delivery of computing services over the internet",
        "C": "A type of weather forecasting software",
        "D": "Using a computer without a monitor"
      },
      "a": "B"
    },
    {
      "q": "Which of these is a type of malware?",
      "o": {
        "A": "Trojan",
        "B": "Anti-virus",
        "C": "Firewall",
        "D": "Chrome"
      },
      "a": "A"
    },
    {
      "q": "What is the purpose of a device driver?",
      "o": {
        "A": "To drive a car",
        "B": "To allow the OS to communicate with hardware devices",
        "C": "To clean the hard drive",
        "D": "To increase RAM speed"
      },
      "a": "B"
    }
  ],
         

  "PHY 101.pdf": [
    {
      "q": "The maximum range of a projectile occurs at an angle of...",
      "o": {
        "A": "30°",
        "B": "45°",
        "C": "60°",
        "D": "90°"
      },
      "a": "B"
    },
    {
      "q": "A car travelling with a uniform velocity of 30 m/s along a horizontal road overcomes a constant frictional force of 600 N. Calculate the power of the engine of the car.",
      "o": {
        "A": "20 W",
        "B": "18,000 W",
        "C": "630 W",
        "D": "20,000 W"
      },
      "a": "B"
    },
    {
      "q": "Name the device that converts heat energy to electrical energy.",
      "o": {
        "A": "Electric motor",
        "B": "Thermocouple",
        "C": "Generator",
        "D": "Solar cell"
      },
      "a": "B"
    },
    {
      "q": "The point where the line of best fit cuts the vertical axis is called...",
      "o": {
        "A": "Slope",
        "B": "Gradient",
        "C": "Intercept",
        "D": "Origin"
      },
      "a": "C"
    },
    {
      "q": "A body moving at a constant speed accelerates when it is in...",
      "o": {
        "A": "A straight line",
        "B": "A vacuum",
        "C": "Circular motion",
        "D": "Equilibrium"
      },
      "a": "C"
    },
    {
      "q": "A body accelerates uniformly from rest at 2 m/s². Calculate the magnitude of its velocity after travelling 4 m.",
      "o": {
        "A": "2 m/s",
        "B": "4 m/s",
        "C": "8 m/s",
        "D": "16 m/s"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is NOT a unit of energy?",
      "o": {
        "A": "Watt",
        "B": "Kilowatt-hour",
        "C": "Calorie",
        "D": "Joule"
      },
      "a": "A"
    },
    {
      "q": "The unit cycle per second is also called...",
      "o": {
        "A": "Newton",
        "B": "Hertz",
        "C": "Pascal",
        "D": "Joule"
      },
      "a": "B"
    },
    {
      "q": "The trajectory path of a projectile is...",
      "o": {
        "A": "A circle",
        "B": "A straight line",
        "C": "A parabola",
        "D": "Hyperbolic"
      },
      "a": "C"
    },
    {
      "q": "Which of the following is a fundamental unit?",
      "o": {
        "A": "m/s",
        "B": "Candela",
        "C": "Newton",
        "D": "m/s²"
      },
      "a": "B"
    },
    {
      "q": "The slope of a straight line displacement-time graph represents...",
      "o": {
        "A": "Acceleration",
        "B": "Velocity",
        "C": "Force",
        "D": "Distance"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is NOT a derived unit?",
      "o": {
        "A": "Area",
        "B": "Thrust",
        "C": "Pressure",
        "D": "Mass"
      },
      "a": "D"
    },
    {
      "q": "Which of the following is incorrect?",
      "o": {
        "A": "Distance is a scalar",
        "B": "Displacement is a vector",
        "C": "Speed is a vector",
        "D": "Velocity is a vector"
      },
      "a": "C"
    },
    {
      "q": "What is the engine power of a car with retarding force 500 N moving at constant speed 20 m/s?",
      "o": {
        "A": "10,000 W",
        "B": "25 W",
        "C": "2,500 W",
        "D": "520 W"
      },
      "a": "A"
    },
    {
      "q": "A ball of mass 0.5 kg moving at 10 m/s collides with another ball of equal mass at rest. If the two balls move together after impact, calculate their common velocity.",
      "o": {
        "A": "10 m/s",
        "B": "5 m/s",
        "C": "2.5 m/s",
        "D": "0 m/s"
      },
      "a": "B"
    },
    {
      "q": "Which of the following correctly gives the relationship between linear speed (v) and angular speed (ω) of a body moving uniformly in a circle of radius r?",
      "o": {
        "A": "v = ω × r",
        "B": "v = ω² × r",
        "C": "v = ω × r²",
        "D": "v = ω / r"
      },
      "a": "A"
    },
    {
      "q": "If no net force acts on an object, the object maintains a state of rest or constant speed in a straight line. This is a statement of Newton's...",
      "o": {
        "A": "First Law",
        "B": "Second Law",
        "C": "Third Law",
        "D": "Law of Universal Gravitation"
      },
      "a": "A"
    },
    {
      "q": "A chemical balance is used for measuring...",
      "o": {
        "A": "Weight",
        "B": "Mass",
        "C": "Density",
        "D": "Volume"
      },
      "a": "B"
    },
    {
      "q": "A body is projected with an initial velocity u at an angle θ to the horizontal. The time taken by it to reach its maximum height is given by:",
      "o": {
        "A": "u sin θ / g",
        "B": "2 u sin θ / g",
        "C": "u² sin θ / g",
        "D": "u cos θ / g"
      },
      "a": "A"
    },
    {
      "q": "A body of mass 1000 kg is released from a height of 10 m above the ground. Determine its kinetic energy just before it strikes the ground. (g = 10 m/s²)",
      "o": {
        "A": "10,000 J",
        "B": "100,000 J",
        "C": "1,000 J",
        "D": "200,000 J"
      },
      "a": "B"
    },
    {
      "q": "When a body is thrown vertically upwards, its velocity at the maximum height is...",
      "o": {
        "A": "Maximum",
        "B": "10 m/s",
        "C": "Zero",
        "D": "Equal to its initial velocity"
      },
      "a": "C"
    },
    {
      "q": "Which of the following sources of energy is renewable?",
      "o": {
        "A": "Petroleum",
        "B": "Charcoal",
        "C": "Hydro",
        "D": "Nuclear"
      },
      "a": "C"
    },
    {
      "q": "The type of collision in which the two objects join together after an impact and move with the same velocity is termed:",
      "o": {
        "A": "Elastic collision",
        "B": "Perfectly inelastic collision",
        "C": "Partially elastic collision",
        "D": "Explosive collision"
      },
      "a": "B"
    },
    {
      "q": "The potential energy in an elastic string of force constant k which has been extended by x metres is expressed as:",
      "o": {
        "A": "k x",
        "B": "k x²",
        "C": "½ k x²",
        "D": "½ k² x"
      },
      "a": "C"
    },
    {
      "q": "The density of a block is 150 grams per cubic centimetre and has a mass of 80 grams. Calculate the volume of the block.",
      "o": {
        "A": "1.875 cm³",
        "B": "0.533 cm³",
        "C": "12,000 cm³",
        "D": "1.50 cm³"
      },
      "a": "B"
    },
    {
      "q": "Which of the following is the unit of force?",
      "o": {
        "A": "Watt",
        "B": "Joule",
        "C": "Newton",
        "D": "Newton-second"
      },
      "a": "C"
    },
    {
      "q": "What type of relationship exists between A and B if the increase in value A brings a decrease in the value of B?",
      "o": {
        "A": "Direct",
        "B": "Inverse",
        "C": "Quadratic",
        "D": "Geometric"
      },
      "a": "B"
    },
    {
      "q": "The dependent variable in the equation F = ke is:",
      "o": {
        "A": "F",
        "B": "k",
        "C": "e",
        "D": "None of the above"
      },
      "a": "A"
    },
    {
      "q": "The point where the line of best fit touches the vertical axis is called:",
      "o": {
        "A": "Slope",
        "B": "Origin",
        "C": "Intercept",
        "D": "Gradient"
      },
      "a": "C"
    },
    {
      "q": "Which of the following readings cannot be determined with a Micrometer screw gauge?",
      "o": {
        "A": "20.15 mm",
        "B": "5.02 mm",
        "C": "21.130 cm",
        "D": "2.54 mm"
      },
      "a": "C"
    },
    {
      "q": "A man of mass 50 kg ascends a flight of stairs 5 m high in 5 s. If acceleration due to gravity is 10 m/s², the power expended is...",
      "o": {
        "A": "50 W",
        "B": "250 W",
        "C": "500 W",
        "D": "2500 W"
      },
      "a": "C"
    },
    {
      "q": "Under which of the following conditions is work done?",
      "o": {
        "A": "A man supports a heavy load above his head with his hands",
        "B": "A boy climbs onto a table",
        "C": "A woman holds a pot",
        "D": "A bag of cocoa stands on a platform"
      },
      "a": "B"
    },
    {
      "q": "A loaded test-tube which floats upright in water is carefully and slightly depressed and then released. Which of the following best describes the subsequent motion?",
      "o": {
        "A": "Random",
        "B": "Circular",
        "C": "Linear",
        "D": "Oscillatory"
      },
      "a": "D"
    },
    {
      "q": "Which of the following is correct in Equations of Motion?",
      "o": {
        "A": "V = a / t",
        "B": "v = u - at",
        "C": "v = at - u",
        "D": "v = u + at"
      },
      "a": "D"
    },
    {
      "q": "A car travelling at a uniform speed of 120 km/h passes two stations in 4 minutes. Calculate the distance between the two stations.",
      "o": {
        "A": "8 km",
        "B": "30 km",
        "C": "480 km",
        "D": "2 km"
      },
      "a": "A"
    },
    {
      "q": "Which of the following is not an essential component of a graph?",
      "o": {
        "A": "Title",
        "B": "Coordinate axes",
        "C": "Scales",
        "D": "None of the above"
      },
      "a": "D"
    },
    {
      "q": "The slope of the graph obtained in a simple pendulum experiment when a graph of l is plotted against T squared is 0.25 m/s². Determine the value of g.",
      "o": {
        "A": "2.50 m/s²",
        "B": "4.00 m/s²",
        "C": "9.87 m/s²",
        "D": "39.48 m/s²"
      },
      "a": "C"
    },
    {
      "q": "In a simple pendulum experiment, the value of T ________ as the value of l increases.",
      "o": {
        "A": "decreases",
        "B": "increases",
        "C": "remains constant",
        "D": "increases and later decreases"
      },
      "a": "B"
    },
    {
      "q": "A simple pendulum makes 50 oscillations in one minute. Determine its period of oscillation.",
      "o": {
        "A": "0.83 s",
        "B": "1.20 s",
        "C": "50.0 s",
        "D": "1.50 s"
      },
      "a": "B"
    },
    {
      "q": "The period of oscillation of a simple pendulum is 2 s when the length of the string is 64 cm. Calculate the period if the string's length is shortened to 49 cm.",
      "o": {
        "A": "1.50 s",
        "B": "1.75 s",
        "C": "1.85 s",
        "D": "2.25 s"
      },
      "a": "B"
    },
    {
      "q": "A force of 10 N produced an extension of 2.50 cm. Determine the spring constant.",
      "o": {
        "A": "0.25 N/cm",
        "B": "2.50 N/cm",
        "C": "4.00 N/cm",
        "D": "25.0 N/cm"
      },
      "a": "C"
    },
    {
      "q": "In Hooke’s law experiment, a graph of the extension e was plotted against Force F. If the slope of the graph is 0.4 mN⁻¹, what is the value of k?",
      "o": {
        "A": "0.4 N/m",
        "B": "2.5 N/m",
        "C": "4.0 N/m",
        "D": "1.4 N/m"
      },
      "a": "B"
    },
    {
      "q": "The energy stored in a spring of stiffness constant k = 2000 N/m when extended by 4 cm is:",
      "o": {
        "A": "1.6 J",
        "B": "16.0 J",
        "C": "80.0 J",
        "D": "3.2 J"
      },
      "a": "A"
    },
    {
      "q": "Which of the following affect the period of a simple pendulum?",
      "o": {
        "A": "length of string",
        "B": "mass of the bob",
        "C": "acceleration due to gravity",
        "D": "Both (A) and (C)"
      },
      "a": "D"
    },
    {
      "q": "Which of the following represent the correct precision if the length of a piece of wire is measured with a metre rule?",
      "o": {
        "A": "35 mm",
        "B": "35.0 mm",
        "C": "35.00 mm",
        "D": "35.01 mm"
      },
      "a": "B"
    },
      
      
  {
    "q": "A car travelling at 30 m/s overcomes a frictional force of 100 N. The power developed by the engine is (1 hp = 0.75 kW).",
    "o": {
      "A": "3 kW",
      "B": "4 kW",
      "C": "5 kW",
      "D": "6 kW"
    },
    "a": "C"
  },
  {
    "q": "Which of the following is the unit of moment of inertia?",
    "o": {
      "A": "kg·m²",
      "B": "kg/m",
      "C": "kg·m",
      "D": "kg·cm⁻²"
    },
    "a": "A"
  },
  {
    "q": "When an elastic material is stretched by a force, the energy stored in it is:",
    "o": {
      "A": "Kinetic energy",
      "B": "Heat energy",
      "C": "Strain energy",
      "D": "Electrical energy"
    },
    "a": "C"
  },
  {
    "q": "A body of mass 1000 kg is released from a height of 10 m. Its kinetic energy just before hitting the ground is (g = 10 m/s²).",
    "o": {
      "A": "1,000 J",
      "B": "5,000 J",
      "C": "10,000 J",
      "D": "100,000 J"
    },
    "a": "D"
  },
  {
    "q": "The product of pressure and volume has the same dimension as:",
    "o": {
      "A": "Force",
      "B": "Energy",
      "C": "Power",
      "D": "Momentum"
    },
    "a": "B"
  }
],

   
"MTH 101 By Bro Waheed": [
  {
    "q": "Find α + β for 3x² - 2x + 9 = 0.",
    "o": {
      "A": "-2/3",
      "B": "3/2",
      "C": "2/3",
      "D": "5"
    },
    "a": "C"
  },
  {
    "q": "If a < 0, the parabola of the quadratic equation is:",
    "o": {
      "A": "Maximum",
      "B": "Minimum",
      "C": "None",
      "D": "All of the above"
    },
    "a": "A"
  },
  {
    "q": "Find the quadratic equation which has roots 2 and -7.",
    "o": {
     "A": "x² - 5x + 14",
      "B": "x² - 5x - 14",
      "C": "x² + 5x - 14",
      "D": "x + 5x² - 14"
    },
    "a": "C"
  },
  {
    "q": "Solve the quadratic equation: x² + 5x - 6.",
    "o": {
      "A": "1, 6",
      "B": "3, 2",
      "C": "1, -6",
      "D": "-1, -6"
    },
    "a": "C"
  },
  {
    "q": "Quadratic equation is degree ___ of polynomial.",
    "o": {
      "A": "degree 5",
      "B": "6",
      "C": "3",
      "D": "2"
    },
    "a": "D"
  },
  {
    "q": "A ladder 6 m long leans against a wall making an angle of 65° with the horizontal. Calculate how far up the wall the ladder reaches (3 s.f.).",
    "o": {
      "A": "5.33 m",
      "B": "4.83 m",
      "C": "7 m",
      "D": "5.44 m"
    },
    "a": "D"
  },
  {
    "q": "The 12th term of an AP is -41. If the first term is 3, find the common difference.",
    "o": {
      "A": "4",
      "B": "-5",
      "C": "-4",
      "D": "9"
    },
    "a": "C"
  },
  {
    "q": "If S is directly proportional to T and T = 120 when S = 30, find T when S = 136.",
    "o": {
      "A": "544",
      "B": "-544",
      "C": "99",
      "D": "208"
    },
    "a": "A"
  },
  {
    "q": "Simplify √80 + √20 - √45.",
    "o": {
      "A": "4√3",
      "B": "6√4",
      "C": "3√5",
      "D": "5√3"
    },
    "a": "A"
  },
  {
    "q": "Find the conjugate of √3 + √2.",
    "o": {
      "A": "√3 - √7",
      "B": "√4 + 3",
      "C": "√3 + √2",
      "D": "√3 - √2"
    },
    "a": "D"
  },
  {
    "q": "Find the range: 20, 40, 3, 8, 9, 50.",
    "o": {
      "A": "27",
      "B": "7",
      "C": "47",
      "D": "9"
    },
    "a": "C"
  },
  {
    "q": "The set that has no element is called ___.",
    "o": {
      "A": "Empty set",
      "B": "Universal set",
      "C": "Singleton set",
      "D": "None"
    },
    "a": "A"
  },
  {
    "q": "Given U = {x : 1 ≤ x ≤ 20}, A = {x : x is a prime number}, B = {even numbers}. Find A ∩ B.",
    "o": {
      "A": "{2}",
      "B": "{}",
      "C": "{2, 5, 10}",
      "D": "{1, 2}"
    },
    "a": "A"
  },
  {
    "q": "Find the remainder when f(x) = 2x³ - 3x² + 4x - 1 is divided by x - 1.",
    "o": {
      "A": "1",
      "B": "-2",
      "C": "2",
      "D": "-1"
    },
    "a": "D"
  },
  {
    "q": "What is i⁵?",
    "o": {
      "A": "i",
      "B": "√1",
      "C": "-1",
      "D": "1"
    },
    "a": "A"
  },
  {
    "q": "A = [[1, 2], [3, 4]]. Find |A|.",
    "o": {
      "A": "2",
      "B": "-2",
      "C": "3",
      "D": "1"
    },
    "a": "B"
  },
  {
    "q": "The set of positive whole numbers is ___.",
    "o": {
      "A": "ℕ",
      "B": "ℚ ∪ ℚᶜ",
      "C": "ℂ",
      "D": "ℤ"
    },
    "a": "A"
  },
  {
    "q": "The set of rational and irrational numbers are ___.",
    "o": {
      "A": "ℚ ∪ ℚᶜ",
      "B": "ℕ",
      "C": "ℂ",
      "D": "ℚ"
    },
    "a": "A"
  },
  {
    "q": "Simplify (75 a² b⁻²) / (5 a³ b⁻³).",
    "o": {
      "A": "15a/b",
      "B": "-15b/a",
      "C": "15b/a",
      "D": "15ab"
    },
    "a": "C"
  },
  {
    "q": "4ˣ = 0.5. Find x.",
    "o": {
      "A": "2",
      "B": "-3/2",
      "C": "1/2",
      "D": "-1/2"
    },
    "a": "D"
  },
  {
    "q": "Given log₁₀2 = 0.3010, log₁₀3 = 0.4771, log₁₀5 = 0.6990. Find log₁₀(1/2).",
    "o": {
      "A": "0.6990",
      "B": "0.3010",
      "C": "-0.3010",
      "D": "0"
    },
    "a": "C"
  },
  {
    "q": "log₂(x² - 2x + 5) = 2. Solve for x.",
    "o": {
      "A": "4, 5",
      "B": "1 twice",
      "C": "-1 twice",
      "D": "2, -5"
    },
    "a": "C"
  },
  {
    "q": "If tan x = 1, evaluate sin x + cos x.",
    "o": {
      "A": "√3/2",
      "B": "√2/2",
      "C": "√2",
      "D": "1"
    },
    "a": "B"
  },
  {
    "q": "sin²θ + cos²θ is ___.",
    "o": {
      "A": "5",
      "B": "3",
      "C": "1",
      "D": "0"
    },
    "a": "C"
  },
  {
    "q": "y = cos 3x, find dy/dx.",
    "o": {
      "A": "-sin 3x",
      "B": "3 cos 3x",
      "C": "-3 sin 3x",
      "D": "0"
    },
    "a": "C"
  },
  {
    "q": "y = sin x, find dy/dx.",
    "o": {
      "A": "-cos x",
      "B": "cos x",
      "C": "tan x",
      "D": "sec x"
    },
    "a": "B"
  },
  {
    "q": "y = 5x², find dy/dx.",
    "o": {
      "A": "4x",
      "B": "10x²",
      "C": "-5x",
      "D": "10x"
    },
    "a": "D"
  },
  {
    "q": "Evaluate sin 60° + cos 30°.",
    "o": {
      "A": "5√3",
      "B": "2√3",
      "C": "4√5",
      "D": "√3"
    },
    "a": "B"
  },
  {
    "q": "If Z₁ = 1 - 3i and Z₂ = -2 + 5i, find Z₁Z₂.",
    "o": {
      "A": "13 - 11i",
      "B": "14 + 11i",
      "C": "13 + 11i",
      "D": "13"
    },
    "a": "A"
  },
  {
    "q": "f(x) = 2x² + 5x³ - 9x - 18. Find f(2).",
    "o": {
      "A": "13",
      "B": "-12",
      "C": "9",
      "D": "12"
    },
    "a": "B"
  },
  {
    "q": "U = {x : -1 ≤ x ≤ 25}, A = {x : 2 ≤ x < 18}, B = {x : 7 < x ≤ 25}, C = {x : -1 ≤ x < 9}. Find A ∩ B ∪ C.",
    "o": {
      "A": "{x : 2 ≤ x ≤ 3}",
      "B": "{x : -1 ≤ x < 18}",
      "C": "{x : -1 ≤ x ≤ 18}",
      "D": "{}"
    },
    "a": "B"
  }
],
   
  "GNS 113": [
    {
      q: "Define the word library",
      o: {
        A: "A place where books are systematically acquired, organized, stored and disseminated to users.",
        B: "A building where books are kept for users.",
        C: "Places where library users buy read and disseminate information to users.",
        D: "A & B"
      },
      a: "A"
    },
     {
      q: "The section, which is the image maker of the library is called………………",
      o: {
        A: "Cataloguing Section",
        B: "Circulation Section",
        C: "Serial Section",
        D: "Reprographic Section"
      },
      a: "B"
    },
    {
      q: "These are unit in Reader’s services section of Gbenga Daniel library except",
      o: {
        A: "Reference Unit",
        B: "Circulating Unit",
        C: "Binding Unit",
        D: "Reserve Unit"
      },
      a: "C"
    },
    {
      q: "………………………… is the nerve center of educational institution.",
      o: {
        A: "Library",
        B: "High Institution",
        C: "Librarian",
        D: "University Web Page"
      },
      a: "A"
    },
    {
      q: "All these are characteristics of reference materials except",
      o: {
        A: "They cannot be read from cover to cover like book",
        B: "The content are arranged systematically for easy access",
        C: "They are use within the library",
        D: "They can be borrowed out of the library by library users"
      },
      a: "D"
    },
    {
      q: "The library that coordinates the activities of other libraries is called …………………",
      o: {
        A: "National library",
        B: "Academic library",
        C: "Electronic library",
        D: "Special library"
      },
      a: "A"
    },
    {
      q: "OPAC Stand for:",
      o: {
        A: "Online Public Access Catalogue",
        B: "Online Periodicals Access Centre",
        C: "Online Patents Access Centre",
        D: "None of the above"
      },
      a: "A"
    },
    {
      q: "Items protected by copyright include all of the following except",
      o: {
        A: "Films and Video",
        B: "Artistic work",
        C: "Photographs",
        D: "Verbal expression"
      },
      a: "D"
    },
    {
      q: "In context of library, what is library automation?",
      o: {
        A: "The process of converting library resources from Manual to Digital",
        B: "The process of converting library resources from digital to automation",
        C: "The process of converting library resources from automation to manual",
        D: "All of the above"
      },
      a: "A"
    },
    {
      q: "The preliminary parts of a book include the following except",
      o: {
        A: "Copyright",
        B: "Index",
        C: "References",
        D: "Appendix"
      },
      a: "D"
    },
    {
      q: "The type of library that is found in higher institution of learning is called __________.",
      o: {
        A: "School Library",
        B: "Academic Library",
        C: "Research Library",
        D: "Private Library"
      },
      a: "B"
    },
    {
      q: "The right to prevent people from copying work which has been created by intellectual effort is called",
      o: {
        A: "Photocopy right",
        B: "Copyright",
        C: "Abstract right",
        D: "Reading guidance"
      },
      a: "B"
    },
    {
      q: "_________ is the classification scheme use by Academic libraries",
      o: {
        A: "Library of Congress",
        B: "Dewey",
        C: "Moys",
        D: "All of the above"
      },
      a: "A"
    },
    {
      q: "All these are materials kept in the Reference Section of the library except",
      o: {
        A: "Textbook",
        B: "Handbook",
        C: "Encyclopedia",
        D: "Dictionary"
      },
      a: "A"
    },
    {
      q: "What is the full meaning of ISSN?",
      o: {
        A: "International Standard Series Number",
        B: "International Standard Serial Number",
        C: "International Standard Select Number",
        D: "International Series Standard Number"
      },
      a: "B"
    },
    {
      q: "Define Card Catalogue?",
      o: {
        A: "A list of materials held in the library by para-librarian",
        B: "A list of record of materials held by more than one library",
        C: "A card file in catalogue cabinet showing the users what book the library has in the collection",
        D: "None of the chemistry"
      },
      a: "C"
    },
    {
      q: "All these are types of card catalogue except",
      o: {
        A: "Title card",
        B: "Author card",
        C: "Catalogue scheme",
        D: "Subject catalogue"
      },
      a: "C"
    },
    {
      q: "The section of the library where users and library staff interact with the book is called",
      o: {
        A: "Circulation Section",
        B: "Public ordinance",
        C: "Serials Section",
        D: "Reprographic section"
      },
      a: "A"
    },
    {
      q: "What Is Serials Publication?",
      o: {
        A: "These are publication issue yearly by a librarian",
        B: "These are publication issued in a successive part bearing numerical or chronological designed and intended to be continue indefinitely",
        C: "These is publication issued in a succession parts bearing numerical or chronological designed and intended to be continue indefinitely with ISBN",
        D: "None of the above"
      },
      a: "B"
    },
    {
      q: "Which of the following cannot be regarded as “multimedia”.",
      o: {
        A: "A tape-slide programme",
        B: "A CD-ROM with text and visuals",
        C: "Micro-Film",
        D: "A web page"
      },
      a: "D"
    },
    {
      q: ".................. is a reference materials that provides information on a wide range of subjects, and attempt to summarize the whole body of human knowledge",
      o: {
        A: "Almanacs",
        B: "Yearbook",
        C: "Directory",
        D: "Encyclopedia"
      },
      a: "D"
    },
    {
      q: "One of the criteria’s to consider when selecting each piece of information is",
      o: {
        A: "Objectivity",
        B: "Sharpness",
        C: "Authorship",
        D: "Briefness"
      },
      a: "A"
    },
    {
      q: "The act of citing, quoting or coping other authors work(s)(or other peoples work) without due acknowledgement to such author is",
      o: {
        A: "Copyright",
        B: "Plagiarism",
        C: "Authorship",
        D: "Ownership"
      },
      a: "B"
    },
    {
      q: "Journal / Periodicals can be found at which section of the library",
      o: {
        A: "Circulation Section",
        B: "Reference Section",
        C: "Reserve Section",
        D: "Serials Section"
      },
      a: "D"
    },
    {
      q: "The internet is a collection of vast information sources of interlinked computer networks",
      o: {
        A: "True",
        B: "None of the above",
        C: "False",
        D: "All of the above"
      },
      a: "A"
    },
    {
      q: "All these are example of search engines except",
      o: {
        A: "www.google.com",
        B: "www.ask.com",
        C: "www.altavista.com",
        D: "regoffice.com"
      },
      a: "D"
    },
    {
      q: "Research Assistance is a service given to user to have proper ________ information",
      o: {
        A: "Assistance",
        B: "Access",
        C: "Needs of information",
        D: "Explore"
      },
      a: "C"
    },
    {
      q: "Collection of information held in some forms of computerized or electronic format is called ________",
      o: {
        A: "Projectors",
        B: "Film",
        C: "Machine Readable materials",
        D: "E-learning"
      },
      a: "C"
    },
    {
      q: "________ is the Library that issues the International Standard Book Number (ISBN)",
      o: {
        A: "Commercial Library",
        B: "Special Library",
        C: "National Library",
        D: "Private Library"
      },
      a: "C"
    },
    {
      q: "The following is a form of classification scheme except ________",
      o: {
        A: "DDC",
        B: "UDC",
        C: "COLON",
        D: "Lending"
      },
      a: "D"
    },
    {
      q: "________ enable user to find the contents of millions of web pages simultaneously",
      o: {
        A: "Search engine",
        B: "Microchip",
        C: "Meta data",
        D: "Microform"
      },
      a: "A"
    },
    {
      q: "Boolean Operators uses combination of terms such as ________",
      o: {
        A: "IN and OUT",
        B: "BUT and NOT",
        C: "AND, OR and NOT",
        D: "OR and TERMS"
      },
      a: "C"
    },
    {
      q: "________ is the ability to identify likely sources of information",
      o: {
        A: "Information literate person",
        B: "Information retrieval",
        C: "Research assistance",
        D: "Evaluate"
      },
      a: "A"
    },
    {
      q: "________ is about selecting wide range of stock which will allow people to enrich and enjoy themselves academically",
      o: {
        A: "Information Retrieval",
        B: "Information needs",
        C: "Reading guidance",
        D: "Lending"
      },
      a: "C"
    },
    {
      q: "The connection to other Library enables ________ to use other libraries",
      o: {
        A: "Book use",
        B: "Users",
        C: "Patients",
        D: "Viewers"
      },
      a: "B"
    },
    {
      q: "The use of Information Communication Technology in service delivery helps in……",
      o: {
        A: "Effective and higher percentage of inquiry resolution",
        B: "Confusing the users needs",
        C: "Promoting books displays",
        D: "Readers’ development"
      },
      a: "A"
    },
    {
      q: "The published record of conference, congress, and symposium is called……",
      o: {
        A: "Proceedings",
        B: "Newspapers",
        C: "Journals",
        D: "Reports"
      },
      a: "A"
    },
    {
      q: "Library of Congress Classification uses …… and ……",
      o: {
        A: "Alphabet and numbers",
        B: "Alpha and letters",
        C: "Arabic and numbers",
        D: "English and French"
      },
      a: "A"
    },
    {
      q: "The following databases require subscription before you can have access to them except……",
      o: {
        A: "EBSCOHOST",
        B: "JSTOR",
        C: "AGORA",
        D: "TEXTBOOK"
      },
      a: "D"
    },
    {
      q: "A demonstration of how information is sourced from e-book collection or other electronic sources is called……",
      o: {
        A: "CD-ROM searches",
        B: "Metajengine",
        C: "On-line",
        D: "AGORA"
      },
      a: "A"
    },
    {
      q: "…… is not an example of special library",
      o: {
        A: "Cocoa House",
        B: "International Institute of Tropical Agriculture (IITA)",
        C: "Forestry Research Institute of Nigeria (FRIN)",
        D: "Cocoa Research Institute of Nigeria (CRIN)"
      },
      a: "A"
    },
    {
      q: "A book that provides a list of names and addresses of people in an organization or institution is ________",
      o: {
        A: "Encyclopedia",
        B: "Directory",
        C: "Year book",
        D: "Almanac"
      },
      a: "B"
    },
    {
      q: "________ supports and co-ordinates the day to day activities of the Library",
      o: {
        A: "Readers’ services",
        B: "Technical services",
        C: "Reference unit",
        D: "General administration"
      },
      a: "D"
    },
    {
      q: "________ is the process of grouping together items which have certain characteristics",
      o: {
        A: "Catalogue",
        B: "Classification",
        C: "Colon",
        D: "Card"
      },
      a: "B"
    },
    {
      q: "________ is the descriptive list of books",
      o: {
        A: "Dictionary",
        B: "Bibliography",
        C: "Gazette",
        D: "Directories"
      },
      a: "B"
    },
    {
      q: "A library that belongs to a particular establishment is called ________",
      o: {
        A: "Private Library",
        B: "National Library",
        C: "Research Library",
        D: "International Library"
      },
      a: "C"
    },
    {
      q: "________ is a pointer to information",
      o: {
        A: "Loans",
        B: "Index",
        C: "Abstract",
        D: "Copyright"
      },
      a: "B"
    },
    {
      q: "A brief summary of the findings and points of a periodical article is called ________",
      o: {
        A: "Information",
        B: "Library Service",
        C: "Abstract",
        D: "Book loan"
      },
      a: "C"
    },
    {
      q: "As a registered user of Gbenga Daniel Library you can only borrow ..........number of books as student",
      o: {
        A: "Four",
        B: "Five",
        C: "Three",
        D: "Two"
      },
      a: "D"
    },
     {
        q: "The second R in SQ3R (study techniques) is .........",
        o: { A: "Remember", B: "Recite", C: "Read", D: "Review "},
        a: "B" 
     }
  ],

  
  "EDU 101": [
  {
    q: "Which of the following is NOT identified as a component of Pedagogical Content Knowledge?",
    o: { A: "Knowledge of Subject Matter", B: "Knowledge of Students", C: "Knowledge of Educational Technology", D: "Knowledge of Curriculum" },
    a: "C"
  },
  {
    q: "What organization was established to regulate entry into the teaching profession in Nigeria?",
    o: { A: "Nigerian Union of Teachers", B: "Ministry of Education", C: "Teachers Registration Council of Nigeria (TRCN)", D: "National Education Council" },
    a: "C"
  },
  {
    q: "Which of the following is NOT one of the major ethics of the teaching profession?",
    o: { A: "Moral soundness", B: "Good character", C: "Political activism", D: "Dedication and Locality" },
    a: "C"
  },
  {
    q: "What is the role of the learners in the teaching-learning process?",
    o: { A: "A passive recipient of knowledge", B: "An active recipient of knowledge", C: "A follower of the teacher's instructions", D: "A recorder of information presented by the teacher" },
    a: "B"
  },
  {
    q: "What does the term \"content\" refer to in the teaching-learning process?",
    o: { A: "The physical environment where learning takes place", B: "The subject matter or knowledge the teacher intends to transmit", C: "The teaching methods employed by the teacher", D: "The assessment strategies used to evaluate learning" },
    a: "B"
  },
  {
    q: "What was the primary method of education in pre-colonial Nigeria?",
    o: { A: "Formal classroom instruction", B: "Informal, practical, community-based learning", C: "Distance learning through written correspondence", D: "Individual tutoring by specialized teachers" },
    a: "B"
  },
  {
    q: "Which institution was central to Islamic education in Northern Nigeria?",
    o: { A: "Grammar schools", B: "Government colleges", C: "Qur'anic schools", D: "British mission schools" },
    a: "C"
  },
  {
    q: "When did Christian missionary education begin in Nigeria?",
    o: { A: "11th century", B: "15th century", C: "19th century", D: "20th century" },
    a: "C"
  },
  {
    q: "What was the primary focus of the curriculum in missionary schools?",
    o: { A: "Science and technology", B: "The 3 R's and religious instruction", C: "Political education and colonial administration", D: "Traditional African knowledge systems" },
    a: "B"
  },
  {
    q: "How many years of primary education are specified in Nigeria's 6-3-3-4 education system?",
    o: { A: "3 years", B: "4 years", C: "5 years", D: "6 years" },
    a: "D"
  },
  {
    q: "Many people mistakenly believe that \"anyone can teach\" because:",
    o: { A: "Teaching is only for highly trained professionals", B: "Teaching occurs in both formal and informal situations", C: "Teaching is a very complex profession", D: "Teaching requires specialized scientific knowledge" },
    a: "B"
  },
  {
    q: "Teaching is defined as a process through which a teacher guides learners to acquire knowledge, skills, values, attitudes, and:",
    o: { A: "Entertainment", B: "Beliefs", C: "Technology", D: "Competition" },
    a: "B"
  },
  {
    q: "Which of the following steps involves checking what learners already know before teaching begins?",
    o: { A: "Guiding learning activities", B: "Evaluating learning outcomes", C: "Establishing entry behaviour", D: "Providing feedback" },
    a: "C"
  },
  {
    q: "In the teaching process, \"How shall I teach?\" refers to the:",
    o: { A: "Learner", B: "Evaluation", C: "Method", D: "Content" },
    a: "C"
  },
  {
    q: "The role of the teacher in the communication model corresponds to which element?",
    o: { A: "Message", B: "Receiver", C: "Channel", D: "Sender" },
    a: "D"
  },
  {
    q: "If learners fail to understand a lesson and the teacher decides to reteach using songs or games, this reflects teaching as:",
    o: { A: "Propaganda", B: "Communication", C: "Indoctrination", D: "Decision-making" },
    a: "D"
  },
  {
    q: "Indoctrination differs from teaching because indoctrination:",
    o: { A: "Promotes questioning and critical thinking", B: "Teaches step-by-step skills", C: "Forces beliefs on learners without allowing inquiry", D: "Involves two-way communication" },
    a: "C"
  },
  {
    q: "Instructional objectives are described as behavioural because they:",
    o: { A: "Describe the teacher’s activities during the lesson", B: "Indicate observable learner actions after instruction", C: "Explain the long-term aims of education", D: "Reflect only cognitive domain outcomes" },
    a: "B"
  },
  {
    q: "Which of the following is the MOST appropriate instructional objective for the topic Identification of Colours?",
    o: { A: "Understanding primary colours", B: "Learners will be taught primary colours", C: "Learners will identify the three primary colours", D: "Identifying and mixing primary colours" },
    a: "C"
  },
  {
    q: "Which action verb is MOST appropriate for an instructional objective in a lower primary colour-identification class?",
    o: { A: "Evaluate", B: "Identify", C: "Analyse", D: "Critique" },
    a: "B"
  },
  {
    q: "A teacher states: \"Learners will describe how mixing red and blue makes purple.\" This objective reflects which mastery level?",
    o: { A: "Knowledge", B: "Comprehension", C: "Application", D: "Evaluation" },
    a: "B"
  },
  {
    q: "Which of the following best illustrates the use of student–teacher joint preparation of objectives?",
    o: { A: "Teacher lists all lesson objectives alone", B: "Students decide what topic to teach next", C: "Teacher asks learners at the start what colours they wish to identify", D: "Students write all instructional objectives themselves" },
    a: "C"
  },
  {
    q: "The lowest level of Bloom’s cognitive domain is concerned with:",
    o: { A: "Making judgments", B: "Breaking information into parts", C: "Recalling previously learned facts", D: "Using concepts in new situations" },
    a: "C"
  },
  {
    q: "A teacher asks students to \"solve real-life problems using simultaneous equations.\" This objective belongs to:",
    o: { A: "Knowledge", B: "Application", C: "Analysis", D: "Evaluation" },
    a: "B"
  },
  {
    q: "The ability to identify assumptions, differentiate facts from opinions, and detect relationships describes which cognitive level?",
    o: { A: "Analysis", B: "Synthesis", C: "Evaluation", D: "Comprehension" },
    a: "A"
  },
  {
    q: "\"Formulate a new method for assessing learner participation in class.\" This objective fits into:",
    o: { A: "Application", B: "Synthesis", C: "Comprehension", D: "Knowledge" },
    a: "B"
  },
  {
    q: "Education contributes to human capital formation primarily by:",
    o: { A: "Increasing national tax rates", B: "Equipping individuals with skills and competencies for productive work", C: "Reducing population growth automatically", D: "Eliminating all forms of discrimination" },
    a: "B"
  },
  {
    q: "One major way education reduces poverty is by:",
    o: { A: "Promoting cultural diversity", B: "Restricting technological advancement", C: "Increasing earning capacity and improving standards of living", D: "Encouraging early retirement" },
    a: "C"
  },
  {
    q: "A skilled and educated workforce enhances national economic growth mainly because it:",
    o: { A: "Makes citizens more religious", B: "Attracts investments and boosts industrialization", C: "Reduces the need for international relations", D: "Eliminates the informal sector" },
    a: "B"
  },
  {
    q: "Education promotes social development through:",
    o: { A: "Forced cultural assimilation", B: "Transmission of societal values, norms, and desirable behaviours", C: "Avoiding interaction between different social groups", D: "Removing traditional practices entirely" },
    a: "B"
  },
  {
    q: "Which of the following best describes how education reduces social inequalities?",
    o: { A: "It increases competition among the wealthy", B: "It gives equal educational opportunities to marginalized groups", C: "It eliminates all cultural practices", D: "It reduces the need for government policies" },
    a: "B"
  },
  {
    q: "Educated individuals tend to make better health choices because they:",
    o: { A: "Rely solely on cultural myths", B: "Understand health information and adopt healthy lifestyles", C: "Avoid formal medical systems", D: "Fully depend on traditional healers" },
    a: "B"
  },
  {
    q: "Education supports political development by:",
    o: { A: "Encouraging voter intimidation", B: "Promoting civic awareness and respect for human rights", C: "Eliminating political parties", D: "Reducing public participation in governance" },
    a: "B"
  },
  {
    q: "One major link between education and technological development is that education:",
    o: { A: "Prevents the adoption of new technologies", B: "Encourages scientific thinking and innovation", C: "Focuses mainly on outdated knowledge", D: "Discourages creativity" },
    a: "B"
  },
  {
    q: "Education promotes cultural development by:",
    o: { A: "Eliminating indigenous languages", B: "Suppressing cultural differences", C: "Preserving cultural heritage and encouraging cultural tolerance", D: "Discouraging interaction with other cultures" },
    a: "C"
  }
],
   
  "PHY 101": [
    {
      q: "Which of the following is a fundamental physical quantity?",
      o: { A: "Force", B: "Velocity", C: "Mass", D: "Pressure" },
      a: "C"
    },
    {
      q: "The SI unit of force is",
      o: { A: "Joule", B: "Watt", C: "Newton", D: "Pascal" },
      a: "C"
    },
    {
      q: "Which of the following quantities is dimensionless?",
      o: { A: "Density", B: "Strain", C: "Pressure", D: "Acceleration" },
      a: "B"
    },
    {
      q: "The dimensional formula of velocity is",
      o: { A: "[LT⁻¹]", B: "[LT⁻²]", C: "[MLT⁻¹]", D: "[L²T⁻¹]" },
      a: "A"
    },
    {
      q: "A vector quantity has",
      o: { A: "magnitude only", B: "direction only", C: "magnitude and direction", D: "neither magnitude nor direction" },
      a: "C"
    },
    {
      q: "Which of the following is a scalar quantity?",
      o: { A: "Displacement", B: "Velocity", C: "Acceleration", D: "Speed" },
      a: "D"
    },
    {
      q: "The slope of a displacement–time graph represents",
      o: { A: "acceleration", B: "velocity", C: "distance", D: "momentum" },
      a: "B"
    },
    {
      q: "The area under a velocity–time graph gives",
      o: { A: "acceleration", B: "speed", C: "displacement", D: "force" },
      a: "C"
    },
    {
      q: "Work is said to be done when a force causes",
      o: { A: "heat", B: "motion", C: "pressure", D: "friction" },
      a: "B"
    },
    {
      q: "The SI unit of work is",
      o: { A: "Newton", B: "Joule", C: "Watt", D: "Pascal" },
      a: "B"
    },
    {
      q: "Kinetic energy depends on",
      o: { A: "mass only", B: "velocity only", C: "mass and velocity", D: "force and distance" },
      a: "C"
    },
    {
      q: "Potential energy due to gravity depends on",
      o: { A: "mass and height", B: "mass and speed", C: "force and time", D: "height and velocity" },
      a: "A"
    },
    {
      q: "Motion of a body along a circular path at constant speed is called",
      o: { A: "linear motion", B: "oscillatory motion", C: "uniform circular motion", D: "random motion" },
      a: "C"
    },
    {
      q: "The force acting on a body in circular motion is directed towards the",
      o: { A: "center", B: "tangent", C: "surface", D: "outside" },
      a: "A"
    },
    {
      q: "This force is known as",
      o: { A: "gravitational force", B: "frictional force", C: "centripetal force", D: "centrifugal force" },
      a: "C"
    },
    {
      q: "The angular velocity of a body in circular motion is measured in",
      o: { A: "m/s", B: "rad/s", C: "m/s²", D: "rad" },
      a: "B"
    },
    {
      q: "Simple harmonic motion is a motion in which the restoring force is",
      o: { A: "constant", B: "zero", C: "proportional to displacement", D: "proportional to velocity" },
      a: "C"
    },
    {
      q: "Which of the following executes simple harmonic motion?",
      o: { A: "A falling stone", B: "A vibrating tuning fork", C: "A moving car", D: "Flowing water" },
      a: "B"
    },
    {
      q: "The time taken for one complete oscillation is called",
      o: { A: "frequency", B: "amplitude", C: "period", D: "wavelength" },
      a: "C"
    },
    {
      q: "The SI unit of frequency is",
      o: { A: "second", B: "hertz", C: "radian", D: "joule" },
      a: "B"
    },
    {
      q: "A rigid body is one in which the distance between particles remains",
      o: { A: "variable", B: "zero", C: "constant", D: "infinite" },
      a: "C"
    },
    {
      q: "The turning effect of a force is known as",
      o: { A: "momentum", B: "work", C: "torque", D: "energy" },
      a: "C"
    },
    {
      q: "Torque is the product of",
      o: { A: "force and velocity", B: "force and distance from pivot", C: "mass and acceleration", D: "pressure and area" },
      a: "B"
    },
    {
      q: "The SI unit of torque is",
      o: { A: "Nm", B: "J", C: "W", D: "kgm²" },
      a: "A"
    },
    {
      q: "The point about which a body rotates is called",
      o: { A: "center of mass", B: "pivot", C: "centroid", D: "axis" },
      a: "D"
    },
    {
      q: "The moment of inertia depends on",
      o: { A: "mass only", B: "shape only", C: "mass distribution", D: "velocity" },
      a: "C"
    },
    {
      q: "Matter is made up of",
      o: { A: "waves", B: "molecules", C: "energy", D: "force" },
      a: "B"
    },
    {
      q: "Elasticity is the ability of a material to",
      o: { A: "conduct heat", B: "change color", C: "regain original shape", D: "break easily" },
      a: "C"
    },
    {
      q: "Hooke’s law states that stress is proportional to",
      o: { A: "force", B: "strain", C: "pressure", D: "energy" },
      a: "B"
    },
    {
      q: "The SI unit of stress is",
      o: { A: "N", B: "Nm", C: "N/m²", D: "kg" },
      a: "C"
    },
    {
      q: "Which property explains why liquids flow?",
      o: { A: "Elasticity", B: "Viscosity", C: "Plasticity", D: "Rigidity" },
      a: "B"
    },
    {
      q: "Surface tension is measured in",
      o: { A: "N", B: "N/m", C: "J", D: "kg/m³" },
      a: "B"
    },
    {
      q: "Heat is a form of",
      o: { A: "matter", B: "force", C: "energy", D: "mass" },
      a: "C"
    },
    {
      q: "The SI unit of heat is",
      o: { A: "calorie", B: "joule", C: "watt", D: "kelvin" },
      a: "B"
    },
    {
      q: "Temperature is a measure of",
      o: { A: "total heat", B: "average kinetic energy", C: "total energy", D: "internal energy" },
      a: "B"
    },
    {
      q: "The SI unit of temperature is",
      o: { A: "Celsius", B: "Fahrenheit", C: "Kelvin", D: "Joule" },
      a: "C"
    },
    {
      q: "Heat transfer by direct contact is called",
      o: { A: "radiation", B: "convection", C: "conduction", D: "evaporation" },
      a: "C"
    },
    {
      q: "The first law of thermodynamics is a statement of conservation of",
      o: { A: "mass", B: "momentum", C: "energy", D: "force" },
      a: "C"
    },
    {
      q: "A thermodynamic system that exchanges energy but not matter is",
      o: { A: "isolated", B: "closed", C: "open", D: "adiabatic" },
      a: "B"
    },
    {
      q: "Boyle’s law states that pressure is inversely proportional to",
      o: { A: "temperature", B: "mass", C: "volume", D: "density" },
      a: "C"
    },
    {
      q: "Charles’ law relates volume and",
      o: { A: "pressure", B: "mass", C: "temperature", D: "density" },
      a: "C"
    },
    {
      q: "The SI unit of pressure is",
      o: { A: "bar", B: "atmosphere", C: "pascal", D: "mmHg" },
      a: "C"
    },
    {
      q: "Which gas law combines Boyle’s and Charles’ laws?",
      o: { A: "Dalton’s law", B: "Ideal gas law", C: "Graham’s law", D: "Avogadro’s law" },
      a: "B"
    },
    {
      q: "The equation of state of an ideal gas is",
      o: { A: "PV = T", B: "PV = nRT", C: "P = V/T", D: "V = nR" },
      a: "B"
    },
    {
      q: "Absolute zero temperature is",
      o: { A: "0°C", B: "−100°C", C: "−273°C", D: "273°C" },
      a: "C"
    },
    {
      q: "At constant pressure, increase in temperature causes volume to",
      o: { A: "decrease", B: "remain constant", C: "increase", D: "disappear" },
      a: "C"
    },
    {
      q: "The number of molecules in a gas depends on",
      o: { A: "pressure only", B: "volume only", C: "temperature only", D: "amount of gas" },
      a: "D"
    },
    {
      q: "Real gases deviate from ideal behavior at",
      o: { A: "high temperature and low pressure", B: "low temperature and high pressure", C: "room temperature", D: "constant volume" },
      a: "B"
    },
    {
      q: "Avogadro’s law states that equal volumes of gases at the same temperature and pressure contain",
      o: { A: "equal masses", B: "equal densities", C: "equal number of molecules", D: "equal energies" },
      a: "C"
    },
    {
      q: "Which instrument is used to measure gas pressure?",
      o: { A: "Thermometer", B: "Barometer", C: "Hygrometer", D: "Calorimeter" },
      a: "B"
    }
  ],
  
  
  "CHM 101": [
    {
      q: "Which of the following is a physical change?",
      o: { A: "Rusting of iron", B: "Burning of wood", C: "Sublimation of camphor", D: "Neutralization" },
      a: "C"
    },
    {
      q: "The fundamental particle of matter that can take part in a chemical reaction is the ______.",
      o: { A: "Molecule", B: "Atom", C: "Ion", D: "Electron" },
      a: "B"
    },
    {
      q: "A pure substance that cannot be broken down into simpler substances by chemical means is a/an ______.",
      o: { A: "Compound", B: "Element", C: "Mixture", D: "Alloy" },
      a: "B"
    },
    {
      q: "Which law states that \"matter can neither be created nor destroyed\"?",
      o: { A: "Law of Constant Composition", B: "Law of Multiple Proportions", C: "Law of Conservation of Mass", D: "Law of Reciprocal Proportion" },
      a: "C"
    },
    {
      q: "A mixture of sand and ammonium chloride can best be separated by ______.",
      o: { A: "Filtration", B: "Distillation", C: "Sublimation", D: "Decantation" },
      a: "C"
    },
    {
      q: "Who discovered the nucleus of the atom?",
      o: { A: "J.J. Thomson", B: "Ernest Rutherford", C: "James Chadwick", D: "John Dalton" },
      a: "B"
    },
    {
      q: "The maximum number of electrons that can occupy the 'p' orbital is ______.",
      o: { A: "2", B: "6", C: "10", D: "14" },
      a: "B"
    },
    {
      q: "What is the electronic configuration of Calcium (Z=20)?",
      o: { A: "[Ar] 4s\u00B2", B: "[Ar] 3d\u00B2", C: "[Ne] 3s\u00B2 3p\u00B6", D: "1s\u00B2 2s\u00B2 2p\u00B6 3s\u00B2" },
      a: "A"
    },
    {
      q: "Isotopes of the same element have the same number of ______ but different number of ______.",
      o: { A: "Protons, electrons", B: "Protons, neutrons", C: "Neutrons, protons", D: "Electrons, protons" },
      a: "B"
    },
    {
      q: "The shape of the 's' orbital is ______.",
      o: { A: "Dumbbell", B: "Spherical", C: "Cloverleaf", D: "Linear" },
      a: "B"
   },
    {
      q: "A bond formed by the sharing of electrons between two atoms is called a/an ______ bond.",
      o: { A: "Ionic", B: "Metallic", C: "Covalent", D: "Dative" },
      a: "C"
    },
    {
      q: "In the Lewis structure of NH\u2083, how many lone pairs are on the Nitrogen atom?",
      o: { A: "0", B: "1", C: "2", D: "3" },
      a: "B"
    },
    {
      q: "Which of the following molecules violates the octet rule?",
      o: { A: "CH\u2084", B: "PCl\u2085", C: "H\u2082O", D: "CO\u2082" },
      a: "B"
    },
    {
      q: "An electrovalent bond is formed between ______.",
      o: { A: "Two non-metals", B: "A metal and a non-metal", C: "Two metals", D: "Noble gases" },
      a: "B"
    },
    {
      q: "Which molecule contains a triple bond?",
      o: { A: "O\u2082", B: "N\u2082", C: "H\u2082", D: "Cl\u2082" },
      a: "B"
    },
    {
      q: "The hybridization of the central Carbon atom in methane (CH\u2084) is ______.",
      o: { A: "sp", B: "sp\u00B2", C: "sp\u00B3", D: "dsp\u00B2" },
      a: "C"
    },
    {
      q: "A molecule with sp\u00B2 hybridization typically has a ______ geometry.",
      o: { A: "Linear", B: "Tetrahedral", C: "Trigonal planar", D: "Octahedral" },
      a: "C"
    },
    {
      q: "What is the bond angle in a water molecule?",
      o: { A: "180\u00B0", B: "120\u00B0", C: "109.5\u00B0", D: "104.5\u00B0" },
      a: "D"
    },
    {
      q: "According to VSEPR theory, the shape of BeCl\u2082 is ______.",
      o: { A: "Linear", B: "Bent", C: "Trigonal Bipyramidal", D: "Square Planar" },
      a: "A"
    },
    {
      q: "In ethene (C\u2082H\u2084), the bond between carbon atoms consists of ______.",
      o: { A: "Two sigma bonds", B: "Two pi bonds", C: "One sigma and one pi bond", D: "One sigma bond" },
      a: "C"
    },
    {
      q: "How many moles are in 22g of CO\u2082? (C=12, O=16)",
      o: { A: "0.5 moles", B: "1.0 moles", C: "2.0 moles", D: "0.25 moles" },
      a: "A"
    },
    {
      q: "The number of particles in one mole of a substance is ______ (Avogadro’s number).",
      o: { A: "6.02 × 10²²", B: "6.02 × 10²³", C: "1.6 × 10\u207B\u00B9\u2079", D: "3.0 × 10\u2078" },
      a: "B"
    },
    {
      q: "The empirical formula of a compound with molecular formula C\u2086H\u2081\u2082O\u2086 is ______.",
      o: { A: "CH\u2082O", B: "CHO", C: "C\u2082H\u2084O\u2082", D: "C\u2083H\u2086O\u2083" },
      a: "A"
    },
    {
      q: "What volume will 0.5 moles of an ideal gas occupy at STP?",
      o: { A: "22.4 L", B: "11.2 L", C: "44.8 L", D: "5.6 L" },
      a: "B"
    },
    {
      q: "The percentage composition of Oxygen in NaOH is ______ (Na=23, O=16, H=1).",
      o: { A: "40%", B: "16%", C: "50%", D: "25%" },
      a: "A"
    },
    {
      q: "A reaction where heat is released to the surroundings is called ______.",
      o: { A: "Endothermic", B: "Exothermic", C: "Isothermic", D: "Adiabatic" },
      a: "B"
    },
    {
      q: "The minimum energy required for a reaction to occur is called ______.",
      o: { A: "Kinetic energy", B: "Activation energy", C: "Potential energy", D: "Free energy" },
      a: "B"
    },
    {
      q: "Increasing the concentration of reactants generally ______ the rate of reaction.",
      o: { A: "Decreases", B: "Increases", C: "Does not change", D: "Stops" },
      a: "B"
    },
    {
      q: "A substance that speeds up a reaction without being consumed is a ______.",
      o: { A: "Reactant", B: "Product", C: "Catalyst", D: "Inhibitor" },
      a: "C"
    },
    {
      q: "Which of the following is a decomposition reaction?",
      o: { A: "A + B → AB", B: "AB → A + B", C: "AB + C → AC + B", D: "HCl + NaOH → NaCl + H\u2082O" },
      a: "B"
    },
    {
      q: "At equilibrium, the rate of the forward reaction is ______ the rate of the reverse reaction.",
      o: { A: "Greater than", B: "Less than", C: "Equal to", D: "Zero" },
      a: "C"
    },
    {
      q: "According to Le Chatelier's principle, increasing pressure on a gaseous system will shift equilibrium towards the side with ______.",
      o: { A: "More moles", B: "Fewer moles", C: "Higher temperature", D: "Lower density" },
      a: "B"
    },
    {
      q: "For the reaction N\u2082 + 3H\u2082 ⇌ 2NH\u2083, what is the expression for K\u208C?",
      o: { A: "[NH\u2083] / [N\u2082][H\u2082]", B: "[NH\u2083]\u00B2 / [N\u2082][H\u2082]\u00B3", C: "[N\u2082][H\u2082]\u00B3 / [NH\u2083]\u00B2", D: "[NH\u2083] / [N\u2082][H\u2082]\u00B2" },
      a: "B"
    },
    {
      q: "A system at equilibrium is said to be ______.",
      o: { A: "Static", B: "Dynamic", C: "Unstable", D: "Finished" },
      a: "B"
    },
    {
      q: "The effect of a catalyst on a system at equilibrium is to ______.",
      o: { A: "Shift it to the right", B: "Shift it to the left", C: "Reach equilibrium faster", D: "Increase the yield" },
      a: "C"
    },
    {
      q: "In an electrochemical cell, oxidation occurs at the ______.",
      o: { A: "Cathode", B: "Anode", C: "Salt bridge", D: "Electrolyte" },
      a: "B"
    },
    {
      q: "The process of using electricity to decompose a chemical compound is ______.",
      o: { A: "Hydrolysis", B: "Electrolysis", C: "Photolysis", D: "Pyrolysis" },
      a: "B"
    },
    {
      q: "Which of the following is a strong electrolyte?",
      o: { A: "CH\u2083COOH", B: "NH\u2084OH", C: "H\u2082SO\u2084", D: "Pure water" },
      a: "C"
    },
    {
      q: "The unit of electrical charge is the ______.",
      o: { A: "Volt", B: "Ampere", C: "Coulomb", D: "Ohm" },
      a: "C"
    },
    {
      q: "According to Faraday's first law, m = ZIt. What does 'I' represent?",
      o: { A: "Time", B: "Current", C: "Mass", D: "Electrochemical equivalent" },
      a: "B"
    },
    {
      q: "Elements in Group 18 of the periodic table are known as ______.",
      o: { A: "Halogens", B: "Alkali metals", C: "Noble gases", D: "Alkaline earth metals" },
      a: "C"
    },
    {
      q: "Electronegativity ______ across a period from left to right.",
      o: { A: "Decreases", B: "Increases", C: "Remains constant", D: "Fluctuates" },
      a: "B"
    },
    {
      q: "The general formula for Alkanes is __.",
      o: { A: "C\u209CnH\u2092n", B: "C\u209CnH\u2092n+2", C: "C\u209CnH\u2092n-2", D: "C\u209CnH\u2092n+1" },
      a: "B"
    },
    {
      q: "The functional group of an Alkanol (Alcohol) is ______.",
      o: { A: "-COOH", B: "-CHO", C: "-OH", D: "-NH\u2082" },
      a: "C"
    },
    {
      q: "CH\u2083CH\u2082CH\u2083 is the IUPAC name for ______.",
      o: { A: "Methane", B: "Ethane", C: "Propane", D: "Butane" },
      a: "C"
    },
    {
      q: "Which of the following is an aromatic hydrocarbon?",
      o: { A: "Hexane", B: "Benzene", C: "Cyclohexane", D: "Ethene" },
      a: "B"
    },
    {
      q: "Isomers are compounds with the same ______ but different ______.",
      o: { A: "Physical properties, molecular formula", B: "Molecular formula, structural arrangement", C: "Atomic number, mass number", D: "Boiling point, melting point" },
      a: "B"
    },
    {
      q: "The reaction between an organic acid and an alcohol to form an ester is ______.",
      o: { A: "Saponification", B: "Esterification", C: "Polymerization", D: "Fermentation" },
      a: "B"
    },
    {
      q: "Which element is the most electronegative in the periodic table?",
      o: { A: "Oxygen", B: "Chlorine", C: "Fluorine", D: "Nitrogen" },
      a: "C"
    },
    {
      q: "The conversion of glucose to ethanol by yeast is called ______.",
      o: { A: "Distillation", B: "Fermentation", C: "Oxidation", D: "Hydrogenation" },
      a: "B"
    }
  ],


  "MTH 101": [
    {
      q: "If A = {1,2,3,4} and B = {3,4,5,6}, find A ∩ B",
      o: { A: "{1,2}", B: "{3,4}", C: "{5,6}", D: "{1,2,5,6}" },
      a: "B"
    },
    {
      q: "Given U = {1,2,3,4,5,6,7,8} and A = {2,4,6,8}, find A'",
      o: { A: "{1,3,5,7}", B: "{2,4,6,8}", C: "{1,2,3,4}", D: "{5,6,7,8}" },
      a: "A"
    },
    {
      q: "If n(A)=15, n(B)=20 and n(A ∩ B)=5, find n(A ∪ B)",
      o: { A: "25", B: "30", C: "35", D: "40" },
      a: "B"
    },
    {
      q: "The empty set is represented by",
      o: { A: "{0}", B: "{}", C: "1", D: "{ }" },
      a: "B"
    },
    {
      q: "If A ⊂ B, then",
      o: {
        A: "A has more elements than B",
        B: "Every element of A is in B",
        C: "A = B",
        D: "A and B are disjoint"
      },
      a: "B"
    },
    {
      q: "Which of the following is an irrational number?",
      o: { A: "0.25", B: "√2", C: "3/4", D: "0.5" },
      a: "B"
    },
    {
      q: "Simplify √50",
      o: { A: "5√2", B: "10√5", C: "25", D: "2√25" },
      a: "A"
    },
    {
      q: "The decimal representation of a rational number is",
      o: {
        A: "Non-terminating",
        B: "Non-repeating",
        C: "Terminating or repeating",
        D: "Always infinite"
      },
      a: "C"
    },
    {
      q: "Evaluate |−7|",
      o: { A: "−7", B: "7", C: "0", D: "−14" },
      a: "B"
    },
    {
      q: "Arrange in ascending order: −3, 2, −1, 4",
      o: {
        A: "−3, −1, 2, 4",
        B: "−1, −3, 2, 4",
        C: "2, −1, −3, 4",
        D: "4, 2, −1, −3"
      },
      a: "A"
    },
    {
      q: "The degree of the polynomial 4x³ − 2x + 7 is",
      o: { A: "1", B: "2", C: "3", D: "4" },
      a: "C"
    },
    {
      q: "Find f(2) if f(x) = x² − 3x + 1",
      o: { A: "−1", B: "0", C: "1", D: "3" },
      a: "A"
    },
    {
      q: "Which of the following is a quadratic polynomial?",
      o: { A: "3x + 1", B: "x² − 5x + 6", C: "x³ − x + 1", D: "7" },
      a: "B"
    },
    {
      q: "Simplify (x + 3)(x − 2)",
      o: {
        A: "x² + x − 6",
        B: "x² − x − 6",
        C: "x² + 5x − 6",
        D: "x² − 5x + 6"
      },
      a: "A"
    },
    {
      q: "The constant term in 2x³ − x + 5 is",
      o: { A: "2", B: "−1", C: "5", D: "3" },
      a: "C"
    },
    {
      q: "Find the next term: 2, 4, 6, 8, ___",
      o: { A: "9", B: "10", C: "12", D: "16" },
      a: "B"
    },
    {
      q: "The sequence 1, 4, 9, 16, ... is",
      o: { A: "Arithmetic", B: "Geometric", C: "Quadratic", D: "Harmonic" },
      a: "C"
    },
    {
      q: "Find the common difference of 5, 8, 11, 14",
      o: { A: "2", B: "3", C: "4", D: "5" },
      a: "B"
    },
    {
      q: "Find the 5th term of 3, 6, 9, ...",
      o: { A: "12", B: "15", C: "18", D: "21" },
      a: "B"
    },
    {
      q: "The sum of the first 5 natural numbers is",
      o: { A: "10", B: "15", C: "20", D: "25" },
      a: "B"
    },
    {
      q: "The value of i² is",
      o: { A: "1", B: "−1", C: "i", D: "−i" },
      a: "B"
    },
    {
      q: "Simplify (3 + 2i) + (1 − i)",
      o: { A: "4 + i", B: "2 + i", C: "3 + i", D: "4 − i" },
      a: "A"
    },
    {
      q: "Simplify (2 + i)(2 − i)",
      o: { A: "3", B: "4", C: "5", D: "6" },
      a: "C"
    },
    {
      q: "The real part of 5 − 7i is",
      o: { A: "−7", B: "7", C: "5", D: "i" },
      a: "C"
    },
    {
      q: "Which of the following is a pure imaginary number?",
      o: { A: "3 + i", B: "5", C: "−2i", D: "1 − i" },
      a: "C"
    },
    {
      q: "Solve x² − 5x + 6 = 0",
      o: { A: "x = 1, 6", B: "x = 2, 3", C: "x = −2, −3", D: "x = 0, 6" },
      a: "B"
    },
    {
      q: "The roots of x² + 9 = 0 are",
      o: { A: "±3", B: "±9", C: "±3i", D: "±9i" },
      a: "C"
    },
    {
      q: "If f(x) = x³ − 2x + 1, find the remainder when divided by (x − 1)",
      o: { A: "0", B: "−1", C: "1", D: "2" },
      a: "A"
    },
    {
      q: "The discriminant of x² − 4x + 4 = 0 is",
      o: { A: "0", B: "4", C: "−4", D: "16" },
      a: "A"
    },
    {
      q: "A quadratic equation has equal roots when",
      o: { A: "b² − 4ac > 0", B: "b² − 4ac < 0", C: "b² − 4ac = 0", D: "a = 0" },
      a: "C"
    },
    {
      q: "sin 30 =",
      o: { A: "1", B: "1/2", C: "√3/2", D: "0" },
      a: "B"
    },
    {
      q: "cos 60 =",
      o: { A: "1/2", B: "√3/2", C: "1", D: "0" },
      a: "A"
    },
    {
      q: "In a right-angled triangle",
      o: {
        A: "hyp² = sum of sides",
        B: "hyp = opposite",
        C: "hyp² = a² + b²",
        D: "all sides equal"
      },
      a: "C"
    },
    {
      q: "If tan t = 3/4, find sin t",
      o: { A: "3/5", B: "4/5", C: "5/3", D: "5/4" },
      a: "A"
    },
    {
      q: "Find the hypotenuse if sides are 6 cm and 8 cm",
      o: { A: "10 cm", B: "12 cm", C: "14 cm", D: "16 cm" },
      a: "A"
    },
    {
      q: "Which is a real number?",
      o: { A: "i", B: "√−9", C: "−5", D: "2i" },
      a: "C"
    },
    {
      q: "If A = {a,b,c}, number of subsets is",
      o: { A: "3", B: "6", C: "8", D: "9" },
      a: "C"
    },
    {
      q: "Solve 2x − 3 = 7",
      o: { A: "2", B: "3", C: "4", D: "5" },
      a: "D"
    },
    {
      q: "Sum of angles in a triangle is",
      o: { A: "90", B: "180", C: "270", D: "360" },
      a: "B"
    },
    {
      q: "Opposite/hypotenuse is",
      o: { A: "cos", B: "tan", C: "sin", D: "cot" },
      a: "C"
    },
    {
      q: "Product of roots of x² − 7x + 10 = 0 is",
      o: { A: "7", B: "10", C: "−10", D: "−7" },
      a: "B"
    },
    {
      q: "Simplify √81",
      o: { A: "8", B: "9", C: "−9", D: "7" },
      a: "B"
    },
    {
      q: "A sequence with common ratio is",
      o: { A: "Arithmetic", B: "Geometric", C: "Harmonic", D: "Linear" },
      a: "B"
    },
    {
      q: "The imaginary unit is",
      o: { A: "√−1", B: "√1", C: "−1", D: "1" },
      a: "A"
    },
    {
      q: "Evaluate 5⁰",
      o: { A: "0", B: "1", C: "5", D: "undefined" },
      a: "B"
    },
    {
      q: "The remainder when f(x) is divided by (x − a) is",
      o: { A: "f(x)", B: "f(a)", C: "a", D: "x" },
      a: "B"
    },
    {
      q: "If sin t = 1, then t =",
      o: { A: "0", B: "30", C: "60", D: "90" },
      a: "D"
    },
    {
      q: "Real numbers include",
      o: {
        A: "integers only",
        B: "rational only",
        C: "rational and irrational",
        D: "whole numbers only"
      },
      a: "C"
    },
    {
      q: "Solve x² = 16",
      o: { A: "x = 4", B: "x = −4", C: "x = ±4", D: "x = 8" },
      a: "C"
    },
    {
      q: "tan 45 =",
      o: { A: "0", B: "1/2", C: "1", D: "√3" },
      a: "C"
    }
  ],



   
  "PHY 101 (2)": [
    {
      q: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. Calculate the acceleration.",
      o: { A: "100 m/s²", B: "4 m/s²", C: "15 m/s²", D: "0.25 m/s²" },
      a: "B"
    },
    {
      q: "A projectile is launched at 30 m/s at an angle of 30° to the horizontal. Calculate its maximum height. (g = 10 m/s²)",
      o: { A: "11.25 m", B: "45.0 m", C: "22.5 m", D: "15.0 m" },
      a: "A"
    },
    {
      q: "Two vectors of magnitudes 3 N and 4 N act at right angles. What is the magnitude of the resultant?",
      o: { A: "7 N", B: "1 N", C: "5 N", D: "12 N" },
      a: "C"
    },
    {
      q: "A ball is dropped from a height of 80 m. How long does it take to reach the ground? (g = 10 m/s²)",
      o: { A: "8 s", B: "4 s", C: "16 s", D: "2 s" },
      a: "B"
    },
    {
      q: "Calculate the displacement of an object that moves 6 m East and 8 m North.",
      o: { A: "14 m", B: "2 m", C: "10 m", D: "48 m" },
      a: "C"
    },
    {
      q: "A man of mass 70 kg climbs a height of 10 m. Calculate the work done. (g = 10 m/s²)",
      o: { A: "70 J", B: "700 J", C: "7,000 J", D: "70,000 J" },
      a: "C"
    },
    {
      q: "An object of mass 2 kg moves with a velocity of 5 m/s. Calculate its kinetic energy.",
      o: { A: "10 J", B: "25 J", C: "50 J", D: "100 J" },
      a: "C"
    },
    {
      q: "A crane lifts a 500 kg load to a height of 20 m in 10 seconds. Calculate the power developed.",
      o: { A: "1,000 W", B: "10,000 W", C: "5,000 W", D: "50,000 W" },
      a: "B"
    },
    {
      q: "A spring with force constant 200 N/m is compressed by 0.1 m. Calculate the elastic potential energy stored.",
      o: { A: "1 J", B: "20 J", C: "2 J", D: "10 J" },
      a: "C"
    },
    {
      q: "Calculate the efficiency of a machine that requires 1000 J to perform 800 J of useful work.",
      o: { A: "125%", B: "80%", C: "20%", D: "0.8%" },
      a: "B"
    },
    {
      q: "An object moves in a circle of radius 2 m with speed 4 m/s. Calculate the centripetal acceleration.",
      o: { A: "2 m/s²", B: "16 m/s²", C: "8 m/s²", D: "4 m/s²" },
      a: "C"
    },
    {
      q: "Calculate the angular velocity of a wheel rotating at 120 rpm.",
      o: { A: "2π rad/s", B: "4π rad/s", C: "120π rad/s", D: "60 rad/s" },
      a: "B"
    },
    {
      q: "A simple pendulum has a length of 0.9 m. Calculate its period. (g ≈ 10 m/s²)",
      o: { A: "1.9 s", B: "3.0 s", C: "0.9 s", D: "6.0 s" },
      a: "A"
    },
    {
      q: "A particle in SHM has amplitude 0.5 m and frequency 2 Hz. Calculate its maximum velocity.",
      o: { A: "π m/s", B: "2π m/s", C: "0.5π m/s", D: "4 m/s" },
      a: "B"
    },
    {
      q: "Calculate the tension in a string of length 1 m whirling a 0.5 kg mass at 2 m/s.",
      o: { A: "1 N", B: "0.5 N", C: "2 N", D: "4 N" },
      a: "C"
    },
    {
      q: "A force of 10 N is applied at a distance of 0.25 m. Calculate the torque.",
      o: { A: "40 Nm", B: "2.5 Nm", C: "10.25 Nm", D: "0.025 Nm" },
      a: "B"
    },
    {
      q: "Calculate the moment of inertia of a solid cylinder of mass 4 kg and radius 0.1 m.",
      o: { A: "0.02 kg·m²", B: "0.04 kg·m²", C: "0.2 kg·m²", D: "0.4 kg·m²" },
      a: "A"
    },
    {
      q: "A wheel has angular acceleration of 2 rad/s². Starting from rest, find angular velocity after 5 s.",
      o: { A: "2.5 rad/s", B: "7 rad/s", C: "10 rad/s", D: "20 rad/s" },
      a: "C"
    },
    {
      q: "Calculate the angular momentum of a disk with I = 5 kg·m² rotating at 10 rad/s.",
      o: { A: "2 kg·m²/s", B: "50 kg·m²/s", C: "15 kg·m²/s", D: "0.5 kg·m²/s" },
      a: "B"
    },
    {
      q: "A beam is balanced at its center. A 20 N weight is 1 m from the pivot. What weight at 2 m balances it?",
      o: { A: "40 N", B: "20 N", C: "10 N", D: "5 N" },
      a: "C"
    },
    {
      q: "A gas occupies 2 L at 1 atm. If volume is reduced to 0.5 L, find the new pressure.",
      o: { A: "0.25 atm", B: "4 atm", C: "1 atm", D: "0.5 atm" },
      a: "B"
    },
    {
      q: "A gas at 27°C doubles its volume at constant pressure. Find the final temperature.",
      o: { A: "54°C", B: "327°C", C: "600°C", D: "300°C" },
      a: "D"
    },
    {
      q: "Calculate the number of moles in 8 g of Oxygen gas.",
      o: { A: "4 moles", B: "2 moles", C: "0.25 moles", D: "0.5 moles" },
      a: "D"
    },
    {
      q: "Calculate the pressure of 1 mole of gas in a 22.4 L container at 273 K.",
      o: { A: "1 atm", B: "22.4 atm", C: "0.5 atm", D: "2 atm" },
      a: "A"
    },
    {
      q: "A balloon has a volume of 500 cm³ at 300 K. What is its volume at 600 K?",
      o: { A: "250 cm³", B: "1000 cm³", C: "750 cm³", D: "1500 cm³" },
      a: "B"
    },
    {
      q: "Heat required to raise 2 kg of water from 20°C to 70°C. (c = 4200 J/kgK)",
      o: { A: "420,000 J", B: "8,400 J", C: "210,000 J", D: "105,000 J" },
      a: "C"
    },
    {
      q: "Heat needed to melt 0.5 kg of ice at 0°C.",
      o: { A: "1.67×10⁵ J", B: "6.68×10⁵ J", C: "3.34×10⁵ J", D: "1.5×10⁴ J" },
      a: "A"
    },
    {
      q: "A heat engine absorbs 5000 J and performs 1500 J of work. Calculate efficiency.",
      o: { A: "15%", B: "30%", C: "33.3%", D: "70%" },
      a: "C"
    },
    {
      q: "Change in internal energy if system absorbs 200 J and does 50 J of work.",
      o: { A: "250 J", B: "150 J", C: "-150 J", D: "4 J" },
      a: "B"
    },
    {
      q: "Convert 100°F to Celsius.",
      o: { A: "37.8°C", B: "212°C", C: "55.5°C", D: "32°C" },
      a: "A"
    },

    {
      q: "A car moves with a constant velocity of 20 m/s. How far will it travel in 5 s?",
      o: { A: "50 m", B: "80 m", C: "100 m", D: "120 m" },
      a: "C"
    },
    {
      q: "An object of mass 4 kg is accelerated at 3 m/s². Find the force applied.",
      o: { A: "7 N", B: "12 N", C: "16 N", D: "24 N" },
      a: "B"
    },
    {
      q: "A body initially at rest accelerates uniformly at 2 m/s² for 10 s. Find the final velocity.",
      o: { A: "10 m/s", B: "15 m/s", C: "20 m/s", D: "25 m/s" },
      a: "C"
    },
    {
      q: "Calculate the kinetic energy of a body of mass 5 kg moving at 4 m/s.",
      o: { A: "20 J", B: "40 J", C: "60 J", D: "80 J" },
      a: "B"
    },
    {
      q: "A body of mass 2 kg is lifted to a height of 10 m. Take g = 10 m/s². Find its potential energy.",
      o: { A: "100 J", B: "150 J", C: "200 J", D: "250 J" },
      a: "C"
    },
    {
      q: "A stone is thrown vertically upward with a velocity of 20 m/s. How long will it take to reach the highest point?",
      o: { A: "1 s", B: "2 s", C: "3 s", D: "4 s" },
      a: "B"
    },
    {
      q: "An object moves in a circular path of radius 2 m with speed 4 m/s. Find the centripetal acceleration.",
      o: { A: "4 m/s²", B: "6 m/s²", C: "8 m/s²", D: "16 m/s²" },
      a: "C"
    },
    {
      q: "The period of a simple pendulum is 2 s. Find its frequency.",
      o: { A: "0.25 Hz", B: "0.5 Hz", C: "1 Hz", D: "2 Hz" },
      a: "B"
    },
    {
      q: "A force of 10 N acts on a body for 5 s. Find the impulse.",
      o: { A: "2 Ns", B: "15 Ns", C: "50 Ns", D: "100 Ns" },
      a: "C"
    },
    {
      q: "A rigid body rotates with angular velocity 5 rad/s. Find the angular displacement in 4 s.",
      o: { A: "5 rad", B: "10 rad", C: "15 rad", D: "20 rad" },
      a: "D"
    },
    {
      q: "A gas occupies 2 m³ at a pressure of 100 kPa. What will be the pressure if the volume is reduced to 1 m³?",
      o: { A: "50 kPa", B: "100 kPa", C: "150 kPa", D: "200 kPa" },
      a: "D"
    },
    {
      q: "Calculate the density of a substance of mass 500 kg and volume 2 m³.",
      o: { A: "100 kg/m³", B: "200 kg/m³", C: "250 kg/m³", D: "300 kg/m³" },
      a: "C"
    },
    {
      q: "The temperature of a gas is increased from 300 K to 600 K at constant volume. Find the ratio of final pressure to initial pressure.",
      o: { A: "1 : 2", B: "2 : 1", C: "3 : 1", D: "4 : 1" },
      a: "B"
    },
    {
      q: "A metal rod expands by 2 mm when heated. If its original length is 1 m, find the strain.",
      o: { A: "0.002", B: "0.02", C: "0.2", D: "2" },
      a: "A"
    },
    {
      q: "A gas does 500 J of work when it expands. Find the work done by the gas.",
      o: { A: "0 J", B: "250 J", C: "500 J", D: "1000 J" },
      a: "C"
    },
    {
      q: "A body of mass 1 kg moves with velocity 10 m/s. Find its momentum.",
      o: { A: "1 kgm/s", B: "5 kgm/s", C: "10 kgm/s", D: "20 kgm/s" },
      a: "C"
    },
    {
      q: "The heat required is given by Q = mcθ. If m = 2 kg, c = 420 J/kgK, θ = 5 K, find Q.",
      o: { A: "2100 J", B: "3200 J", C: "4200 J", D: "8400 J" },
      a: "D"
    },
    {
      q: "An engine lifts a load of 200 N through a height of 5 m. Find the work done.",
      o: { A: "200 J", B: "500 J", C: "1000 J", D: "1500 J" },
      a: "C"
    },
    {
      q: "If the angular speed of a rotating object is doubled, its centripetal force becomes",
      o: { A: "doubled", B: "halved", C: "four times", D: "unchanged" },
      a: "C"
    },
    {
      q: "A gas at constant pressure has volume 2 m³ at 300 K. Find its volume at 600 K.",
      o: { A: "2 m³", B: "3 m³", C: "4 m³", D: "6 m³" },
      a: "C"
    }
       
  ]



    
};

const SUBJECT_TIME = {
  "PHY 107.pdf": 60 * 15,
  "COS 101 (2)": 60 * 13,
  "COS 101 (1)": 60 * 13,
  "PHY 101.pdf": 60 * 15,
  "MTH 101 By Bro Waheed": 60 * 15,
  "GNS 113": 60 * 15,
  "PHY 101": 60 * 15,
  "CHM 101": 60 * 15,
  "MTH 101": 60 * 20,
  "EDU 101": 60 * 10,
  "PHY 101 (2)": 60 * 15
};

/* ===============================
   3. DOM ELEMENTS
================================ */
const pages = {
  home: document.getElementById("home"),
  name: document.getElementById("namePage"),
  subject: document.getElementById("subjectPage"),
  quiz: document.getElementById("quizPage"),
  result: document.getElementById("resultPage"),
  review: document.getElementById("reviewPage")
};

const subjectList = document.getElementById("subjectList");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const questionNumber = document.getElementById("questionNumber");
const timerBox = document.getElementById("timer");



document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const historyBtn = document.getElementById('historyBtn');
  const historyContent = document.getElementById('historyContent');

  menuBtn.addEventListener('click', () => {
    sidebar.classList.remove('hide');
    historyContent.classList.add('hide'); // hide history content initially
  });

  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('hide');
  });

  historyBtn.addEventListener('click', () => {
    historyContent.classList.remove('hide');
  });
});



/* ===============================
   4. PAGE NAVIGATION
================================ */
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.add("hide"));
  pages[page].classList.remove("hide");
}

/* ===============================
   5. INITIALIZE SUBJECT LIST
================================ */
function loadSubjects() {
  subjectList.innerHTML = "";
  Object.keys(QUESTION_BANK).forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = sub;
    btn.onclick = (e) => selectSubject(sub, e);
    subjectList.appendChild(btn);
  });
}

/* ===============================
   6. SUBJECT SELECTION
================================ */
function selectSubject(subject, event) {
  currentSubject = subject;
  document.querySelectorAll("#subjectList .btn").forEach(b => b.classList.remove("selected"));
  event.target.classList.add("selected");
}

/* ===============================
   7. START QUIZ
================================ */
function startQuiz() {
  if (!currentSubject) return alert("Select a subject");

  questions = QUESTION_BANK[currentSubject];
  currentIndex = 0;
  answers = {};
  quizCompleted = false;
  timeLeft = SUBJECT_TIME[currentSubject] || (60 * 10);

  startTimer();
  renderQuestion();
  saveProgress();

  document.getElementById("quizSubject").textContent = currentSubject;
  showPage("quiz");
}

/* ===============================
   8. RENDER QUESTION
================================ */
function renderQuestion() {
  const q = questions[currentIndex];
  questionNumber.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionText.textContent = q.q;
  optionsBox.innerHTML = "";

  for (let key in q.o) {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = `${key}. ${q.o[key]}`;
    if (answers[currentIndex] === key) div.classList.add("selected");
    div.onclick = () => selectOption(key);
    optionsBox.appendChild(div);
  }
}

/* ===============================
   9. SELECT OPTION
================================ */
function selectOption(key) {
  answers[currentIndex] = key;
  saveProgress();
  renderQuestion();
}

/* ===============================
   10. NEXT & PREVIOUS
================================ */
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

/* ===============================
   11. TIMER
================================ */
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerBox.textContent = formatTime(timeLeft);

    // Add warning class if less than 60 seconds
    if (timeLeft <= 60) {
      timerBox.classList.add("warning");
    } else {
      timerBox.classList.remove("warning");
    }

    saveProgress();

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 750);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ===============================
   12. SUBMIT QUIZ
================================ */
function submitQuiz() {
  clearInterval(timer);
  quizCompleted = true;
  saveProgress();

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.a) score++;
  });

  document.getElementById("resultName").innerHTML = `Name: <span class="label"> ${studentName}</span>`;
document.getElementById("resultSubject").innerHTML = `Subject: <span class="label"> ${currentSubject}</span>`;
  document.getElementById("scoreCircle").textContent = `${score} / ${questions.length}`;
  document.getElementById("percentCircle").textContent =
    Math.round((score / questions.length) * 100) + "%";

  showPage("result");
}

/* ===============================
   13. REVIEW ANSWERS (YOUR FORMAT)
================================ */
function reviewAnswers() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    const userAns = answers[i];

    let html = `<p><strong>Q${i + 1}. ${q.q}</strong></p>`;

    if (!userAns) {
      html += `<p class="unanswered">Your Answer: Not Answered</p>`;
      html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
    } else if (userAns === q.a) {
      html += `<p class="correct">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
    } else {
      html += `<p class="wrong">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
      html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
    }

    div.innerHTML = html + "<hr>";
    list.appendChild(div);
  });

  showPage("review");
}

/* ===============================
   14. RETAKE & GO HOME
================================ */
function retakeQuiz() {
  startQuiz();
}

function goHome() {
  clearInterval(timer);
  localStorage.clear();
  showPage("home");
}

/* ===============================
   15. AUTOSAVE (LOCAL STORAGE)
================================ */
function saveProgress() {
  localStorage.setItem("quizState", JSON.stringify({
    studentName,
    currentSubject,
    currentIndex,
    answers,
    timeLeft,
    quizCompleted
  }));
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("quizState"));
  if (!data || data.quizCompleted) return;

  if (confirm("Resume previous quiz?")) {
    studentName = data.studentName;
    currentSubject = data.currentSubject;
    currentIndex = data.currentIndex;
    answers = data.answers;
    timeLeft = data.timeLeft;
    questions = QUESTION_BANK[currentSubject];

    startTimer();
    renderQuestion();
    showPage("quiz");
  }
}

/* ===============================
   16. EVENT LISTENERS
================================ */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startBtn").onclick = () => showPage("name");

  document.getElementById("continueBtn").onclick = () => {
    studentName = document.getElementById("nameInput").value.trim();
    if (!studentName) return alert("Enter your name");
    loadSubjects();
    showPage("subject");
  };

  document.getElementById("startQuizBtn").onclick = startQuiz;
  document.getElementById("nextBtn").onclick = nextQuestion;
  document.getElementById("prevBtn").onclick = prevQuestion;

  document.getElementById("submitBtn").onclick = () => {
    if (confirm("Are you sure you want to submit the quiz?")) {
      submitQuiz();
    }
  };

   document.getElementById("backNameBtn").onclick = () => {
  showPage("name");
};

document.getElementById("backHomeBtn1").onclick = () => {
  showPage("home");
};

  document.getElementById("retakeBtn").onclick = retakeQuiz;
  document.getElementById("goHomeBtn").onclick = goHome;
  document.getElementById("reviewBtn").onclick = reviewAnswers;
  document.getElementById("backResultBtn").onclick = () => showPage("result");

  const backHomeBtn = document.getElementById("backHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.onclick = () => {
      if (confirm("Are you sure you want to quit the quiz and go back home? Your progress will be lost.")) {
        goHome();
      }
    };
  }

});

/* ===============================
   17. APP BOOTSTRAP
================================ */
function bootstrap() {
  const data = JSON.parse(localStorage.getItem("quizState"));
  if (data && !data.quizCompleted) {
    if (confirm("Resume previous quiz?")) {
      studentName = data.studentName;
      currentSubject = data.currentSubject;
      currentIndex = data.currentIndex;
      answers = data.answers;
      timeLeft = data.timeLeft;
      questions = QUESTION_BANK[currentSubject];
       
     document.getElementById("quizSubject").textContent = currentSubject;
      startTimer();
      renderQuestion();
      showPage("quiz");
      return; // Exit so we don't show home page
    }
  }
  // Show home if no quiz saved or user cancels
  showPage("home");
}

bootstrap();
   
