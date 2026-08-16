import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "../styles/BookAppointment.css";

function BookAppointment() {

    const location = useLocation();

    const selectedDoctor = location.state?.doctor;

    /* =========================================
       Logged-in Patient
    ========================================= */

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const patientName = storedUser.name || "Patient";


    /* =========================================
       States
    ========================================= */

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(false);

    const [fetchLoading, setFetchLoading] = useState(true);


    const [appointment, setAppointment] = useState({

        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",

    });


    /* =========================================
       Fetch Doctors
    ========================================= */

    const fetchDoctors = async () => {

        try {

            setFetchLoading(true);

            const res = await api.get("/doctors");


            if (Array.isArray(res.data)) {

                setDoctors(res.data);

            }

            else if (res.data.doctors) {

                setDoctors(res.data.doctors);

            }

            else {

                setDoctors([]);

            }

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load doctors");

        }

        finally {

            setFetchLoading(false);

        }

    };


    /* =========================================
       Load Doctors
    ========================================= */

    useEffect(() => {

        fetchDoctors();

    }, []);


    /* =========================================
       Selected Doctor
    ========================================= */

    useEffect(() => {

        if (selectedDoctor) {

            setAppointment((prev) => ({

                ...prev,

                doctor: selectedDoctor._id

            }));

        }

    }, [selectedDoctor]);


    /* =========================================
       Handle Change
    ========================================= */

    const handleChange = (e) => {

        setAppointment({

            ...appointment,

            [e.target.name]: e.target.value

        });

    };


    /* =========================================
       Submit Appointment
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;


        try {

            setLoading(true);


            const res = await api.post(
                "/appointments/add",
                appointment
            );


            toast.success(

                res.data.message ||
                "Appointment Booked Successfully"

            );


            setAppointment({

                doctor: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: ""

            });

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||
                "Appointment Booking Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================
       UI
    ========================================= */

    return (

        <div className="appointment-container">

            <div className="appointment-card">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="appointment-header">

                    <h1>
                        📅 Book Appointment
                    </h1>

                    <p>
                        Schedule your consultation with our doctors
                    </p>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* =================================
                        PATIENT NAME
                    ================================= */}

                    <div className="input-group">

                        <label>
                            Patient Name
                        </label>

                        <input
                            type="text"
                            value={patientName}
                            readOnly
                            className="readonly-input"
                        />

                    </div>


                    {/* =================================
                        DOCTOR
                    ================================= */}

                    <div className="input-group">

                        <label>
                            Select Doctor
                        </label>

                        <select

                            name="doctor"

                            value={appointment.doctor}

                            onChange={handleChange}

                            required

                        >

                            <option value="">
                                Choose Doctor
                            </option>


                            {fetchLoading ? (

                                <option value="">
                                    Loading Doctors...
                                </option>

                            ) : doctors.length > 0 ? (

                                doctors.map((doctor) => (

                                    <option
                                        key={doctor._id}
                                        value={doctor._id}
                                    >

                                        Dr. {doctor.name}
                                        {" - "}
                                        {doctor.specialization}

                                    </option>

                                ))

                            ) : (

                                <option value="">
                                    No Doctors Available
                                </option>

                            )}

                        </select>

                    </div>


                    {/* =================================
                        DATE + TIME
                    ================================= */}

                    <div className="input-row">


                        <div className="input-group">

                            <label>
                                Appointment Date
                            </label>

                            <input

                                type="date"

                                name="appointmentDate"

                                value={appointment.appointmentDate}

                                onChange={handleChange}

                                required

                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Appointment Time
                            </label>

                            <input

                                type="time"

                                name="appointmentTime"

                                value={appointment.appointmentTime}

                                onChange={handleChange}

                                required

                            />

                        </div>


                    </div>


                    {/* =================================
                        REASON
                    ================================= */}

                    <div className="input-group">

                        <label>
                            Reason for Visit
                        </label>

                        <textarea

                            name="reason"

                            placeholder="Enter your health problem"

                            value={appointment.reason}

                            onChange={handleChange}

                            required

                        />

                    </div>


                    {/* =================================
                        BUTTON
                    ================================= */}

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {loading
                            ? "Booking..."
                            : "Confirm Appointment"
                        }

                    </button>


                </form>

            </div>

        </div>

    );

}

export default BookAppointment;