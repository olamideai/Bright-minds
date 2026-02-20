/**************************************************
 * TASFUED QUIZ APP – SINGLE SCRIPT.JS (v2.0)
 * Pure Vanilla JavaScript
 **********************************************/

/* ===============================
   1. GLOBAL VARIABLES & STATE
==================================*/
let studentname = "";
let currentSubject = "";
let questions = [];
let currentIndex = 0;
let answers= {};
let timeLeft = 0;
let quizCompleted = false;

/* ===============================
   2. QUESTION DATA (SAMPLE)
   👉 You can add more subjects
================================ */
const QUESTION_BANK = {
"PHY 101/107 (1)": [
   {
      q: "The maximum range of a projectile occurs at:",
      o: { A: "30°", B: "45°", C: "60°", D: "90°" },
      a: "B"
    },
    {
      q: "A car travelling at 30 m/s overcomes a frictional force of 600 N. The power developed is:",
      o: { A: "12,000 W", B: "15,000 W", C: "18,000 W", D: "20,000 W" },
      a: "C"
    },
    {
      q: "The device that converts heat energy into electrical energy is:",
      o: { A: "Generator", B: "Transformer", C: "Turbine", D: "Thermocouple" },
      a: "D"
    },
    {
      q: "The point where the line of best fit cuts the vertical axis is called:",
      o: { A: "Slope", B: "Intercept", C: "Gradient", D: "Origin" },
      a: "B"
    },
    {
      q: "Given T² = 4π²L/g, what is the correct equation for the value of g if a graph of T² is plotted against L?",
      o: { A: "g = 4π²/S", B: "g = 4π²", C: "g = 4π²S", D: "g = 1/S" },
      a: "A"
    },
    {
      q: "A body moving at constant speed accelerates when it is in:",
      o: { A: "Straight line motion", B: "Circular motion", C: "At rest", D: "Uniform motion" },
      a: "B"
    },
    {
      q: "A body accelerates uniformly from rest at 2 m/s². Its velocity after 4 s is:",
      o: { A: "4 m/s", B: "6 m/s", C: "8 m/s", D: "10 m/s" },
      a: "C"
    },
    {
      q: "A force of 100 N acts on 0.15 kg for 0.03 s. The change in speed is:",
      o: { A: "10 m/s", B: "15 m/s", C: "20 m/s", D: "25 m/s" },
      a: "C"
    },
    {
      q: "An object undergoes oscillatory motion when it moves:",
      o: { A: "In a straight line", B: "To and fro about a mean position", C: "Randomly", D: "In a circle" },
      a: "B"
    },
    {
      q: "A body rotates in a circle of radius 2.5 m with angular speed 5 rad/s. The radial acceleration is:",
      o: { A: "25 m/s²", B: "50 m/s²", C: "62.5 m/s²", D: "75 m/s²" },
      a: "C"
    },

    {
      q: "If A = 5i + 2j + k and B = 2i + 4j − 3k, then A × B equals:",
      o: {
        A: "−10i + 17j + 16k",
        B: "10i − 17j − 16k",
        C: "16i + 17j − 10k",
        D: "−16i + 10j + 17k"
      },
      a: "A"
    },

    {
      q: "The potential energy stored in a stretched spring is:",
      o: { A: "½kx", B: "kx", C: "½kx²", D: "kx²" },
      a: "C"
    },

    {
      q: "If a = −100x, the period of oscillation is approximately:",
      o: { A: "0.2 s", B: "0.4 s", C: "0.63 s", D: "1 s" },
      a: "C"
    },

    {
      q: "Which of the following is NOT a unit of energy?",
      o: { A: "Watt", B: "Joule", C: "Calorie", D: "kWh" },
      a: "A"
    },

    {
      q: "If X = 5t² + 2, the instantaneous velocity at t = 2 s is:",
      o: { A: "10 m/s", B: "15 m/s", C: "20 m/s", D: "25 m/s" },
      a: "C"
    },

    {
      q: "The unit “cycle per second” is called:",
      o: { A: "Period", B: "Frequency", C: "Hertz", D: "Amplitude" },
      a: "C"
    },

    {
      q: "The trajectory of a projectile is:",
      o: { A: "Circle", B: "Straight line", C: "Parabola", D: "Ellipse" },
      a: "C"
    },

    {
      q: "Which is a fundamental unit?",
      o: { A: "m/s", B: "candela", C: "newton", D: "m/s²" },
      a: "B"
    },

    {
      q: "For T = KLˣgʸ, the values of x and y are:",
      o: { A: "1, 0", B: "½, −½", C: "½, ½", D: "1, −1" },
      a: "B"
    },

    {
      q: "From velocity–time points (20,5) and (10,3), acceleration is:",
      o: { A: "0.1 m/s²", B: "0.2 m/s²", C: "0.3 m/s²", D: "0.5 m/s²" },
      a: "B"
    },
{
      q: "If F = 2i + 4j and S = i + 5j, work done is:",
      o: { A: "20 J", B: "22 J", C: "18 J", D: "24 J" },
      a: "B"
    },
    {
      q: "Which of the following is derived?",
      o: { A: "kg", B: "m", C: "K", D: "N" },
      a: "D"
    },
    {
      q: "The slope of a displacement–time graph represents:",
      o: { A: "Acceleration", B: "Velocity", C: "Force", D: "Distance" },
      a: "B"
    },
    {
      q: "Time of flight (u = 20 m/s, 30° to horizontal):",
      o: { A: "1 s", B: "2 s", C: "3 s", D: "4 s" },
      a: "B"
    },
    {
      q: "Fundamental quantities are:",
      o: {
        A: "Length, mass and time",
        B: "Speed, length and time",
        C: "Speed, mass and distance",
        D: "Distance, speed and time"
      },
      a: "A"
    },
    {
      q: "For T = kmˣlʸgᶻ, correct values are:",
      o: { A: "1, 0, 1", B: "0, −½, ½", C: "0, ½, −½", D: "0, 1, ½" },
      a: "C"
    },
    {
      q: "Power when F = 20 N, v = 0.2 m/s:",
      o: { A: "2 W", B: "4 W", C: "6 W", D: "8 W" },
      a: "B"
    },
    {
      q: "If no net force acts, this is:",
      o: {
        A: "Newton’s First Law",
        B: "Newton’s Second Law",
        C: "Newton’s Third Law",
        D: "Law of Gravitation"
      },
      a: "A"
    },
    {
      q: "Bullet reaching 500 m vertically, initial velocity is:",
      o: { A: "50 m/s", B: "80 m/s", C: "100 m/s", D: "120 m/s" },
      a: "C"
    },
    {
      q: "Final momentum (F = 5 N, t = 5 s):",
      o: { A: "10 kg·m/s", B: "20 kg·m/s", C: "25 kg·m/s", D: "30 kg·m/s" },
      a: "C"
    },
    {
      q: "Acceleration equals:",
      o: {
        A: "Gradient of displacement–time",
        B: "Gradient of velocity–time",
        C: "Area under speed–time",
        D: "Area under displacement–time"
      },
      a: "B"
    },
    {
      q: "A chemical balance measures:",
      o: { A: "Weight", B: "Mass", C: "Density", D: "Volume" },
      a: "B"
    },
    {
      q: "Power developed (100 N at 30 m/s):",
      o: { A: "2000 W", B: "3000 W", C: "4000 W", D: "5000 W" },
      a: "B"
    },
    {
      q: "Unit of moment of inertia:",
      o: { A: "kg/m²", B: "kg·m²", C: "kg/m³", D: "kg/cm²" },
      a: "B"
    },
    {
      q: "Energy stored in stretched elastic material is:",
      o: {
        A: "Kinetic energy",
        B: "Elastic potential energy",
        C: "Gravitational energy",
        D: "Heat energy"
      },
      a: "B"
    },
    {
      q: "Time to maximum height is:",
      o: { A: "u/g", B: "ucosθ/g", C: "usinθ/g", D: "2usinθ/g" },
      a: "C"
    },
    {
      q: "Acceleration formula is:",
      o: { A: "(v−u)/t", B: "(u−v)/t", C: "(2v−u)/t", D: "(v+u)/t" },
      a: "A"
    },
    {
      q: "A body of mass 1000 kg is released from a height of 10 m. Determine its kinetic energy just before it strikes the ground (g = 10 m/s²).",
      o: { A: "50,000 J", B: "100,000 J", C: "10,000 J", D: "1,000 J" },
      a: "B"
    },
    {
      q: "Calculate the gravitational force between Earth (6.0 × 10²⁴ kg) and Moon (7.0 × 10²² kg) separated by 4.0 × 10⁸ m. (G = 6.7 × 10⁻¹¹ Nm²/kg²)",
      o: {
        A: "1.75 × 10²⁰ N",
        B: "1.75 × 10¹⁹ N",
        C: "1.75 × 10²¹ N",
        D: "1.75 × 10²² N"
      },
      a: "A"
    },
    {
      q: "The product PV has the same dimension as:",
      o: { A: "Pressure", B: "Force", C: "Work", D: "Density" },
      a: "C"
    },
    {
      q: "To determine the density of a liquid after measuring its volume, the student must measure its:",
      o: { A: "Temperature", B: "Pressure", C: "Mass", D: "Height" },
      a: "C"
    },
    {
      q: "When a body is thrown vertically upward, its velocity at maximum height is:",
      o: { A: "Maximum", B: "10 m/s", C: "Zero", D: "Constant" },
      a: "C"
    },
    {
      q: "Material that returns to original form after stress removal is said to be:",
      o: { A: "Plastic", B: "Elastic", C: "Rigid", D: "Brittle" },
      a: "B"
    },
    {
      q: "When linear momentum is constant, the net force acting is:",
      o: { A: "Maximum", B: "Zero", C: "Increasing", D: "Constant" },
      a: "B"
    },
    {
      q: "Which pair is made up of vectors?",
      o: {
        A: "Speed & displacement",
        B: "Mass & force",
        C: "Displacement & acceleration",
        D: "Momentum & length"
      },
      a: "C"
    },
    {
      q: "The SI unit of power is:",
      o: { A: "Joule", B: "Newton", C: "Watt", D: "Pascal" },
      a: "C"
    },
    {
      q: "A pendulum makes 50 oscillations in 60 seconds. Its period is:",
      o: { A: "1.2 s", B: "0.83 s", C: "0.5 s", D: "1.0 s" },
      a: "A"
    },
    {
      q: "A car starts from rest and covers 40 m in 10 s. Acceleration is:",
      o: { A: "0.4 m/s²", B: "0.8 m/s²", C: "4 m/s²", D: "2 m/s²" },
      a: "B"
    },
    {
      q: "Unit equivalent to Watt is:",
      o: {
        A: "kg·m·s⁻²",
        B: "kg·m²·s⁻³",
        C: "kg·m²·s⁻²",
        D: "kg·m²·s⁻¹"
      },
      a: "B"
    },
    {
      q: "If a = (−3 + t²) m/s² and velocity at t = 0 is zero, velocity at t = 3 s is:",
      o: { A: "15 m/s", B: "−3 m/s", C: "9 m/s", D: "6 m/s" },
      a: "D"
   }
    
],
"PHY 101/107 (2)": [
   {
      q: "Device used to determine relative density of acid",
      o: { A: "Manometer", B: "Hydrometer", C: "Hygrometer", D: "Hypsometer" },
      a: "B"
    },
    {
      q: "Electricity meters measure energy in",
      o: { A: "Joules", B: "Watts", C: "Kilowatt-hour (kWh)", D: "Volt" },
      a: "C"
    },
    {
      q: "Tendency of a body to remain at rest is",
      o: { A: "Momentum", B: "Inertia", C: "Force", D: "Pressure" },
      a: "B"
    },
    {
      q: "Area under a force–velocity graph represents",
      o: { A: "Power", B: "Work", C: "Energy", D: "Impulse" },
      a: "A"
    },
    {
      q: "Reflected sound heard after making a sound is",
      o: { A: "Echo", B: "Refraction", C: "Resonance", D: "Pitch" },
      a: "A"
    },
    {
      q: "Dimension of impulse is",
      o: { A: "MLT⁻²", B: "MLT⁻¹", C: "ML⁻¹T", D: "ML²T" },
      a: "B"
    },
    {
      q: "Which is NOT an example of kinetic energy?",
      o: { A: "Student running", B: "Electrical charges in motion", C: "Wind in motion", D: "None of the above" },
      a: "D"
    },
    {
      q: "Correct dimensions of density and pressure",
      o: { A: "ML⁻³ and ML⁻¹T⁻²", B: "ML⁻¹T", C: "ML² and ML⁻²", D: "ML³ and ML⁻²" },
      a: "A"
    },
    {
      q: "Energy stored in spring (k = 2000 N/m, extension = 4 cm)",
      o: { A: "1.6 J", B: "16 J", C: "0.16 J", D: "8 J" },
      a: "A"
    },
    {
      q: "Bullet (0.2 kg, 800 m/s) hits 2 kg wood (inelastic). Final velocity is",
      o: { A: "72.7 m/s", B: "80 m/s", C: "100 m/s", D: "50 m/s" },
      a: "A"
    },
    {
      q: "Range of projected particle is",
      o: { A: "u sinθ.H", B: "u cosθ.T", C: "u tanθ.T", D: "u sinθ.T" },
      a: "D"
    },
    {
      q: "A 60 kg boy runs up 3 m height (g=10). Work done is",
      o: { A: "600 J", B: "1800 J", C: "300 J", D: "200 J" },
      a: "B"
    },
    {
      q: "Maximum force before motion starts is",
      o: { A: "Friction", B: "Static friction", C: "Kinetic friction", D: "Tension" },
      a: "B"
    },
    {
      q: "Density =150 g/cm³, Mass=80 g. Volume is",
      o: { A: "0.53 cm³", B: "53 cm³", C: "12 cm³", D: "5.3 cm³" },
      a: "A"
    },
    {
      q: "Reading that cannot be measured by micrometer screw gauge",
      o: { A: "20.15", B: "5.02", C: "21.130 cm", D: "2.54 cm" },
      a: "D"
    },
    {
      q: "A man of mass 50 kg ascends a flight of stairs 5 m high in 5 seconds. If acceleration due to gravity is 10 ms⁻², the power expended is",
      o: { A: "50 W", B: "500 W", C: "250 W", D: "2500 W" },
      a: "B"
    },
    {
      q: "Under which of the following conditions is work done?",
      o: { A: "A man supports a heavy load above his head with his hands", B: "A boy climbs onto a table", C: "A woman holds a pot", D: "A bag of cocoa stands on a platform" },
      a: "B"
    },
    {
      q: "A loaded test-tube which floats upright in water is carefully and slightly depressed and then released. Which of the following best describes the subsequent motion of the test tube?",
      o: { A: "Random", B: "Circular", C: "Linear", D: "Oscillatory" },
      a: "D"
    },
    {
      q: "Which of the following is correct?",
      o: { A: "V = a/t", B: "v = u - at", C: "v = at - u", D: "v = u + at" },
      a: "D"
    },
    {
      q: "Time is a measure of",
      o: { A: "different physical events", B: "variation between physical events", C: "rate of change of physical events", D: "interval between physical events" },
      a: "D"
    },
    {
      q: "Physics is a pure science that deals with",
      o: { A: "matter", B: "energy", C: "relationship between different forms of energy", D: "relationship between matter and energy" },
      a: "D"
    },
    {
      q: "A car travelling at a uniform speed of 120 kmh⁻¹ passes two stations in 4 minutes. Calculate the distance between the two stations.",
      o: { A: "8 km", B: "30 km", C: "480 km", D: "0.5 km" },
      a: "A"
    },
    {
      q: "The branch of physics that deals with sound and waves is",
      o: { A: "acoustics", B: "geophysics", C: "biophysics", D: "mechanics" },
      a: "A"
    },
    {
      q: "Which of the units of the following physical quantities is not a derived unit?",
      o: { A: "Area", B: "Thrust", C: "Pressure", D: "Mass" },
      a: "D"
    },
    {
      q: "Which of the following is incorrect?",
      o: { A: "Distance is a scalar", B: "Displacement is a vector", C: "Speed is a vector", D: "Velocity is a vector" },
      a: "C"
    },
    {
      q: "Which of these motions could be uniform?",
      o: { A: "Molecular motion", B: "Circular motion", C: "Vibrating pendulum", D: "Vibrational motion" },
      a: "D"
    },
    {
      q: "What is the engine power of a car with retarding force 500 N moving at constant speed 20 ms⁻¹?",
      o: { A: "25 W", B: "10,000 W", C: "520 W", D: "480 W" },
      a: "B"
    },
    {
      q: "The speed of a bullet of mass 20 g is 216 kmh⁻¹. What is its K.E in joules?",
      o: { A: "36 J", B: "466.56 J", C: "0.036 J", D: "36,000 J" },
      a: "A"
    },
    {
      q: "The main cause of motion is",
      o: { A: "Speed", B: "Acceleration", C: "Force", D: "Velocity" },
      a: "C"
    },
    {
      q: "A car travelling at a uniform speed of 120 kmh⁻¹ passes two stations in 4 minutes. Calculate the distance between the two stations.",
      o: { A: "8 km", B: "30 km", C: "480 km", D: "0.5 km" },
      a: "A"
    },
    {
      q: "A ball of mass 0.5 kg moving at 10 ms⁻¹ collides with another ball of equal mass at rest. If the two balls move together after impact, calculate their common velocity.",
      o: { A: "20 ms⁻¹", B: "10 ms⁻¹", C: "5 ms⁻¹", D: "2.5 ms⁻¹" },
      a: "C"
    },
    {
      q: "Which of the following correctly gives the relationship between linear speed, v and angular speed, ω of a body moving uniformly in a circle of radius, r?",
      o: { A: "v = ω r", B: "v = ω² r", C: "v = ω r²", D: "v = ω / r" },
      a: "A"
    },
    {
      q: "The motion of a body is simple harmonic if the",
      o: { A: "acceleration is always directed towards a fixed point", B: "path of motion is a straight line", C: "acceleration is directed towards a fixed point and proportional to its distance from the point", D: "acceleration is constant and directed towards a fixed point" },
      a: "C"
    },
    {
      q: "What is the angular speed of a body vibrating at 50 cycles per second?",
      o: { A: "50π rad/s", B: "100π rad/s", C: "25π rad/s", D: "10π rad/s" },
      a: "B"
    },
    {
      q: "When a mass attached to a spiral spring is set into vertical oscillations, its acceleration will have a",
      o: { A: "varying magnitude but a constant direction", B: "constant magnitude and a constant direction", C: "constant magnitude but a varying direction", D: "varying magnitude and a varying direction" },
      a: "D"
    },
    {
      q: "For a simple pendulum of length, l, the period is given by",
      o: { A: "2π√(l/g)", B: "2π√(g/l)", C: "2π√(g/π)", D: "2g√(l/2π)" },
      a: "A"
    },
    {
      q: "Which is the incorrect formula for a body accelerating uniformly?",
      o: { A: "a = (v² - u²)/2s", B: "v² = u² + 2as", C: "s = 1/2 ut + at²", D: "v = u + at" },
      a: "C"
    },
    {
      q: "A catapult is used to project a stone. Which of the following energy conversions takes place as the stone is released?",
      o: { A: "The kinetic energy of the stone is converted into gravitational potential energy of the catapult", B: "The gravitational potential energy is converted into the kinetic energy of the stone", C: "The elastic potential energy of catapult is converted into the kinetic energy of the stone", D: "The gravitational potential energy is converted into elastic potential energy" },
      a: "C"
    },
    {
      q: "For a freely falling body",
      o: { A: "the ratio of kinetic energy to potential energy is constant", B: "the sum of kinetic and potential energies is constant", C: "the total energy is entirely kinetic", D: "the total energy is entirely potential" },
      a: "B"
    },
    {
      q: "A stationary ball is hit by an average force 50 N for a time of 0.03 s. What is the impulse experienced by the body in newton-second?",
      o: { A: "1.5 Ns", B: "1500 Ns", C: "150 Ns", D: "15 Ns" },
      a: "A"
    },
    {
      q: "Which of the following is not an example of force?",
      o: { A: "Tension", B: "Weight", C: "Mass", D: "Friction" },
      a: "C"
    },
    {
      q: "Which of the following is not a conductor of electricity?",
      o: { A: "Human body", B: "Silver", C: "Glass", D: "Copper" },
      a: "C"
    },
    {
      q: "Power is defined as the",
      o: { A: "rate of doing work", B: "capacity to do work", C: "product of force and time", D: "ability to move" },
      a: "A"
    },
    {
      q: "Which of the following types of motion does a body undergo when moving in a haphazard manner?",
      o: { A: "Random motion", B: "Translational motion", C: "Vibrational motion", D: "Circular motion" },
      a: "A"
    },
    {
      q: "Which of the following quantities has the same unit as energy?",
      o: { A: "Power", B: "Work", C: "Force", D: "Impulse" },
      a: "B"
    },
    {
      q: "Which of the following is a scalar quantity?",
      o: { A: "Tension", B: "Impulse", C: "Distance", D: "Force" },
      a: "C"
    },
    {
      q: "Two bodies each carrying a charge of 2.00 × 10⁻¹⁰ C are 5 cm apart. Calculate the magnitude of the force on the charges. (1/4πε₀ = 9 × 10⁹ Nm²C⁻²)",
      o: { A: "1.44 × 10⁻⁷ N", B: "7.2 × 10⁻⁸ N", C: "7.20 × 10⁻¹¹ N", D: "1.44 × 10⁻¹¹ N" },
      a: "A"
    },
    {
      q: "Which of the following sources of energy is renewable?",
      o: { A: "Petroleum", B: "Charcoal", C: "Hydro", D: "Nuclear" },
      a: "C"
    },
    {
      q: "If an object of mass 50 kg moves at 5 ms⁻¹ round a circular path of radius 10 m, calculate the centripetal force needed to keep it in its orbit",
      o: { A: "125 N", B: "25 N", C: "12.5 N", D: "250 N" },
      a: "A"
    },
    {
      q: "A boy of mass 20 kg moves at 5 ms⁻¹ round a circular path of radius 10 m, calculate the centripetal acceleration",
      o: { A: "2.5 ms⁻²", B: "50 ms⁻²", C: "0.5 ms⁻²", D: "25 ms⁻²" },
      a: "A"
       }
],
"PHY 101/107 (3)": [{
      q: "The type of collision in which the two objects join together after an impact and move with the same velocity is termed...",
      o: { A: "Elastic", B: "Inelastic", C: "Perfectly Inelastic", D: "Explosion" },
      a: "C"
    },
    {
      q: "Given T² = 4π² * (L / g). Which of the following is the correct equation for the value of g if a graph of T² is plotted against L?",
      o: { A: "4π² / L", B: "S / 4π²", C: "4π² S", D: "4π² / S (where S is the slope of the graph)" },
      a: "D"
    },
    {
      q: "The potential energy in an elastic string of force constant K which has been extended by x metres is expressed as...",
      o: { A: "Kx", B: "Kx²", C: "1/2 Kx²", D: "1/2 Kx" },
      a: "C"
    },
    {
      q: "The period of oscillation of a simple pendulum is related to its length L and acceleration g by T = k L^x g^y. Determine the value of x and y where k is a constant.",
      o: { A: "1/2, -1/2", B: "-1/2, 1/2", C: "0, 1/2", D: "1/2, 0" },
      a: "A"
    },
    {
      q: "Given that the period of oscillation of a pendulum is given by T = k m^x L^y g^z where k is a constant. Find the value of x, y and z.",
      o: { A: "1, 0, 1", B: "0, 1/2, -1/2", C: "0, 1/2, 1/2", D: "0, 1, 1/2" },
      a: "B"
    },
    {
      q: "A chemical balance is used for measuring...",
      o: { A: "Weight", B: "Mass", C: "Density", D: "Volume" },
      a: "B"
    },
    {
      q: "When an elastic material is stretched by a force, the energy stored in it is...",
      o: { A: "Kinetic energy", B: "Elastic potential energy", C: "Chemical energy", D: "Thermal energy" },
      a: "B"
    },
    {
      q: "Material that can be stretched and still return to the original forms when the stresses are removed are said to be...",
      o: { A: "Plastic", B: "Elastic", C: "Rigid", D: "Brittle" },
      a: "B"
    },
    {
      q: "A simple pendulum makes X oscillations in one minute. Determine X if its period of oscillation is 1.20 s.",
      o: { A: "50", B: "60", C: "72", D: "100" },
      a: "A"
    },
    {
      q: "The density of a block is 150 gcm⁻³ and has a mass of 80 g. Calculate the volume of the block.",
      o: { A: "12,000 cm³", B: "1.875 cm³", C: "0.533 cm³", D: "18.75 cm³" },
      a: "C"
    },
    {
      q: "Which of the following is the unit of force?",
      o: { A: "W", B: "J", C: "N", D: "Ns" },
      a: "C"
    },
    {
      q: "The graph showing the variation in the angle of deviation of light through prism with the angle of incidence is...",
      o: { A: "a straight line", B: "a curve", C: "a parabola", D: "a hyperbola" },
      a: "B"
    },
    {
      q: "Which of the following graph will give us more information?",
      o: { A: "Linear graph", B: "Non-linear graph", C: "Assotopic graph", D: "Quadratic graph" },
      a: "A"
    },
    {
      q: "What type of relationship exists between A and B if the increase in the value A brings a decrease in the value of B?",
      o: { A: "direct", B: "inverse", C: "quadratic", D: "geometric" },
      a: "B"
    },
    {
      q: "The dependent variable in the equation F = ke is...",
      o: { A: "F", B: "k", C: "e", D: "None of the above" },
      a: "A"
    },
    {
      q: "The point where the line of best fit touches the vertical axis is called...",
      o: { A: "Slope", B: "Origin", C: "Intercept", D: "Gradient" },
      a: "C"
    },
    {
      q: "Which of the following is not an essential component of a graph?",
      o: { A: "Title", B: "Coordinate axes", C: "Scales", D: "None of the above" },
      a: "D"
    },
    {
      q: "The slope of the graph obtained in a simple pendulum experiment when a graph of l is plotted against T² is 0.25 ms⁻². Determine the value of g.",
      o: { A: "9.87 ms⁻² (Using g = 4π² * slope)", B: "10 ms⁻²", C: "1.0 ms⁻²", D: "0.25 ms⁻²" },
      a: "A"
    },
    {
      q: "In a simple pendulum experiment, the value of T ______ as the value of l increases.",
      o: { A: "decreases", B: "increases", C: "remains constant", D: "increases and later decreases" },
      a: "B"
    },
    {
      q: "A simple pendulum makes 50 oscillations in one minute. Determine its period of oscillation.",
      o: { A: "1.2 s", B: "0.83 s", C: "50 s", D: "60 s" },
      a: "A"
    },
    {
      q: "The period of oscillation of a simple pendulum is 2 s when the length of the string is 64 cm. Calculate the period if the string's length is shortened to 49 cm.",
      o: { A: "1.75 s", B: "1.53 s", C: "2.61 s", D: "1.43 s" },
      a: "A"
    },
    {
      q: "A force of 10 N produced an extension of 2.50 cm. Determine the spring constant.",
      o: { A: "4 Nm⁻¹", B: "400 Nm⁻¹", C: "0.25 Nm⁻¹", D: "25 Nm⁻¹" },
      a: "B"
    },
    {
      q: "In Hooke's law experiment, a graph of the extension e was plotted against Force F. If the slope of the graph is 0.4 mN⁻¹. What is the value of k?",
      o: { A: "2.5 Nm⁻¹", B: "0.4 Nm⁻¹", C: "4.0 Nm⁻¹", D: "25 Nm⁻¹" },
      a: "A"
    },
    {
      q: "The energy stored in a spring of stiffness constant k = 2000 Nm⁻¹ when extended by 4 cm is...",
      o: { A: "1.6 J", B: "1600 J", C: "4 J", D: "80 J" },
      a: "A"
    },
    {
      q: "Which of the following affect the period of a simple pendulum?",
      o: { A: "length of string", B: "mass of the bob", C: "acceleration due to gravity", D: "None of the above" },
      a: "A"
    },
    {
      q: "The frequency of a certain pendulum A is 10 cycles per second, and the frequency of another pendulum B is 5 cycles per second. Which pendulum is longer in length?",
      o: { A: "A", B: "B", C: "both are equal in length", D: "A is slightly longer than B" },
      a: "B"
    },
    {
      q: "The period of oscillation can be defined as...",
      o: { A: "time taken for one complete cycle", B: "number of cycles per second", C: "maximum displacement from equilibrium", D: "distance between two crests" },
      a: "A"
    },
    {
      q: "The main reading of a Vernier calliper is 6.2 cm. If the main scale and the vernier scale coincides at the 7th position. What is the total reading of the instrument?",
      o: { A: "6.27 cm", B: "6.9 cm", C: "0.627 cm", D: "62.7 cm" },
      a: "A"
    },
    {
      q: "The diameter of a piece of wire can be most accurate when measured with a...",
      o: { A: "Metre rule", B: "Vernier calliper", C: "Micrometer screw gauge", D: "Tape measure" },
      a: "C"
    },
    {
      q: "Which of the following represent the correct precision if the length of a piece of wire is measured with a metre rule?",
      o: { A: "35 mm", B: "35.0 mm", C: "35.00 mm", D: "35.01 mm" },
      a: "B"
    },
    {
      q: "The smallest scale division of a Vernier caliper is...",
      o: { A: "0.1 cm", B: "0.01 cm", C: "0.001 cm", D: "1.0 cm" },
      a: "B"
    },
    {
      q: "Which of the following is not a part of the micrometer screw gauge?",
      o: { A: "Anvil", B: "Spindle", C: "None", D: "Thimble" },
      a: "C"
    },
    {
      q: "The clenched jaws of the anvil and the spindle are brought into contact through...",
      o: { A: "sleeve", B: "ratchet", C: "anvil", D: "spindle" },
      a: "B"
    },
    {
      q: "A simple pendulum 0.64 m long has a period of 1.2 s, calculate the period of a similar pendulum 0.36 m long in the same location.",
      o: { A: "0.9 s", B: "1.0 s", C: "0.6 s", D: "0.8 s" },
      a: "A"
    },
    {
      q: "An error due to inherent defects in the method or apparatus used is called...",
      o: { A: "Random error", B: "Systematic error", C: "Personal error", D: "Parallax error" },
      a: "B"
    },
    {
      q: "Errors due to personal peculiarities of an observer where human reaction to an event or estimation affects the results are called...",
      o: { A: "Systematic errors", B: "Random errors", C: "Personal errors", D: "Instrumental errors" },
      a: "C"
    },
    {
      q: "The only way to eliminate systematic errors is to...",
      o: { A: "take many readings", B: "use a different instrument/method", C: "be more careful", D: "calculate the mean" },
      a: "B"
    },
    {
      q: "The only remedy to random errors is to...",
      o: { A: "check the zero point", B: "take the average of several readings", C: "use a more expensive tool", D: "ignore them" },
      a: "B"
    },
    {
      q: "The errors due to the accuracy of the division of graduated scales on the instrument is called...",
      o: { A: "Scale error", B: "Personal error", C: "Random error", D: "Parallax error" },
      a: "A"
    },
    {
      q: "Errors due to unknown causes or chance are known as...",
      o: { A: "Systematic errors", B: "Random errors", C: "Personal errors", D: "Instrumental errors" },
      a: "B"
    },
    {
      q: "Experimental errors are usually divided into two main types which are...",
      o: { A: "Personal and Random", B: "Systematic and Random", C: "Scale and Instrumental", D: "Small and Large" },
      a: "B"
    },
    {
      q: "At a glance, _____ gives a comprehensive picture of the experiment than the data themselves.",
      o: { A: "a device", B: "a curve", C: "a line", D: "a graph" },
      a: "D"
    },
    {
      q: "The general form of the equation which yields a straight line is...",
      o: { A: "y = mx² + c", B: "xy = mc", C: "y = mx + c", D: "xy = m² + c" },
      a: "C"
    },
    {
      q: "The S.I. unit of spring constant is...",
      o: { A: "N", B: "Nm", C: "Nm⁻¹", D: "Nm⁻²" },
      a: "C"
    },
    {
      q: "To get the elongation e in Hooke's experiment of elasticity, where L₁ is the initial length and L₂ is the new length. The equation is...",
      o: { A: "e = L₂ - L₁", B: "e = L₁ - L₂", C: "e = L₁ + L₂", D: "e = L₁ / L₂" },
      a: "A"
    },
    {
      q: "The change in velocity of a body at a particular time is known as...",
      o: { A: "Instantaneous velocity", B: "Instantaneous speed", C: "Instantaneous acceleration", D: "Free-fall motion" },
      a: "C"
    },
    {
      q: "If two vectors are represented thus: A = 5i + 2j + k and B = 2i + 4j - 3k. Find A · B.",
      o: { A: "13", B: "15", C: "17", D: "-13" },
      a: "B"
    },
    {
      q: "An object of mass 50 Kg is projected with a velocity of 20 ms⁻¹ at an angle of 60° to the horizontal. Calculate the time of flight.",
      o: { A: "3.46 s", B: "2.0 s", C: "1.73 s", D: "1.0 s" },
      a: "A"
    },
    {
      q: "______ is defined as the process used to check the validity of a specific equation in mechanics.",
      o: { A: "Uncertainty", B: "Dimensional analysis", C: "Motion analysis", D: "Newton's equations of motion" },
      a: "B"
    },
    {
      q: "The independent variable in the equation F = ke is...",
      o: { A: "F", B: "k", C: "e", D: "None of the above" },
      a: "C"
       }
      ]

        
};

const SUBJECT_TIME = {
   "PHY 101/107 (1)": 60 * 15,  
  "PHY 101/107 (2)": 60 * 15,   
  "PHY 101/107 (3)": 60 * 15    
  
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
   updateProgressBar();
}

/* ===============================
   9. SELECT OPTION
================================ */
function selectOption(key) {
  answers[currentIndex] = key;
  saveProgress();

  // Show selected style first
  renderQuestion();

  // Move to next question ONLY if not last
  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
    // If it's the last question → do nothing
  }, 150);
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
/* ==================================
   18. PROGRESS BAR
   ================================ */

   function updateProgressBar() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
   }
/* ===============================
 20. FOOTER MESSAGE 
================================ */

const footerMessages = [
  '🌙 Ramadan Kareem ✨',
  'May Allah accept our fast and prayers 🤲',
  'Designed and powered by <span class="fancy-name">𝓞𝓵𝓪𝓶𝓲𝓭𝓮</span>'
];

let footerIndex = 0; // <-- separate from quiz currentIndex

const footerText = document.getElementById("footer-text");

setInterval(() => {
  // fade out
  footerText.style.opacity = "0";

  // after 300ms, change text and fade in
  setTimeout(() => {
    footerIndex = (footerIndex + 1) % footerMessages.length;
    footerText.innerHTML = footerMessages[footerIndex];
    footerText.style.opacity = "1";
  }, 300);

}, 2000); // <-- switches every 2 seconds
