import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    experience: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      const data = response.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      if (data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && (
          <div className="text-red-600 text-center mb-3">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={onChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full border p-2 rounded"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {formData.role === "doctor" && (
            <>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={onChange}
                required
                className="w-full border p-2 rounded text-gray-700"
              >
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Dentistry">Dentistry</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Gynecology">Gynecology</option>
              </select>

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: Number(e.target.value),
                  }))
                }
                required
                className="w-full border p-2 rounded"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            required
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;