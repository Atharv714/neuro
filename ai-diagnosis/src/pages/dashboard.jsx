import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { auth } from "../firebase-config"; // Import Firebase auth
import { signOut, deleteUser } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Import Bento components and icons from Radix UI
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { LuBrainCircuit } from "react-icons/lu";
import { GiStethoscope } from "react-icons/gi";


const Dashboard = () => {
  const [user, loading] = useAuthState(auth); // Get user and loading state

  if (loading) return <div className="font-varelaround">Loading...</div>;

  if (!user) {
    // Handle case where user is not authenticated
    return <div className="font-varelaround">Unauthorized</div>;
  }

  const fullName = user.displayName || "User";
  const names = fullName.split(" ");
  const firstname = names.length > 0 ? names[0] : "User";

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteUser(auth.currentUser)
        .then(() => {
          // User deleted.
        })
        .catch((error) => {
          console.error("Delete user error:", error);
        });
    }
  };

  // Define features for AI Diagnosis and AI Psychologist
  const features = [
    {
      Icon: GiStethoscope,
      name: "AI Diagnosis",
      description: "Get AI-powered medical diagnosis based on your symptoms.",
      href: "/ai-diagnosis",
      cta: "Try now",
      className:
        "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2 font-varelaround",
    },
    {
      Icon: LuBrainCircuit,
      name: "AI Psychologist",
      description: "Talk to our AI for mental health support.",
      href: "/ai-psychologist",
      cta: "Get help",
      ctaClassName:
        "mt-auto text-center bg-green-500 text-white px-4 py-2 rounded-full",
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: MdOutlineEmergencyShare,
      name: "Emergency SOS",
      description: "Voice inputed safety feature for emergency situations.",
      href: "https://vhelp.onrender.com/",
      cta: "Try SOS",
      ctaClassName:
        "mt-auto text-center bg-green-500 text-white px-4 py-2 rounded-full",
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center w-full">
        <div className="flex-1">
          <h1 className="text-4xl font-semibold font-carmen text-left">
            Welcome,
            <span className="text-green-500"> {firstname}</span>
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 rounded-full bg-green-300 text-black font-varelaround">
              Menu
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDeleteAccount}>
              Delete Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section className="mt-8 ml-1">
        <h2 className="text-xl font-medium font-varelaround">Our Services</h2>

        <BentoGrid className="lg:grid-rows lg:grid-cols-3 mt-8 gap-4">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </section>
    </div>
  );
};

export default Dashboard;
