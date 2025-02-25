"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createLocationAction } from "@/app/actions/actions";

export default function CreateLocationPage() {
  const [LocationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  const HandleCreateLocation = async () => {
   
    setLoading(true);
    setSuccessMessage("");

    try {
       if (!LocationName) {return}
      const response= await createLocationAction(LocationName)

      if (response) {
        setSuccessMessage("Location successfully created!");
        setLocationName("");
      } else {
        setErrorMessage("Error creating team.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Inscribe a Locatione</h2>

      {/* Team Name Input */}
      <Input
        placeholder="Enter Location Name"
        value={LocationName}
        onChange={(e) => setLocationName(e.target.value)}
        className="mb-4 text-white"
      />

      {errorMessage && <p className="text-center mt-4 text-red-400">{errorMessage}</p>}

    
      {/* Submit Button */}
      <Button
        onClick={HandleCreateLocation}
        disabled={loading}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
      >
        {loading ? "Saving..." : "Create Location"}
      </Button>

      {/* Success Message */}
      {successMessage && <p className="text-center mt-4 text-green-400">{successMessage}</p>}
    </div>
  );
}
