import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../UseHooks/useAxiosSecure/useAxiosSecure';
import { useQuery } from 'react-query';
import { Dna } from 'react-loader-spinner';
import useAuth from '../../UseHooks/useAuth/useAuth';

const Medicine = () => {
    const [medicine, setMedicine] = useState([''])
    const [searchMedicine, setSearchMedicine] = useState("");
    const [searchResult, setSearchresult] = useState(true)

    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: medicines = [], refetch, isLoading: pageLoading } = useQuery(['medicine'], async () => {
        const res = await axiosSecure.get('/medicine')
        // console.log(res.data)
        setMedicine(res.data)
        return res.data;
    })
    console.log(medicine)
    if (pageLoading) {
        return <div className='flex justify-center items-center mt-60'>
            <Dna
                visible={true}
                height="200"
                width=""
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    }
    const handlePaymentAmount = (medicine) => {
        console.log('pay', medicine)


        const medicineBuyer = {
            name: medicine.name,
            price_per_unit: medicine.price_per_unit,
            group: medicine.group,
            company: medicine.company,
            purpose: medicine.purpose,
            expire_date: medicine.expire_date,
            Paitent_Name: user?.displayName,
            Patient_Email: user?.email,
        }
        console.log(medicineBuyer)

        fetch('https://doctors-server-update.vercel.app/visitpayment', {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(medicineBuyer)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                window.location.replace(data.url)
            })
    }

    const handleSearch = () => {
        fetch(`https://doctors-server-update.vercel.app/medicineBySearch/${searchMedicine}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMedicine(data);
                if (data.length === 0) {
                    setSearchresult(false)
                } else {
                    setSearchresult(true)
                }

            });
    };

    return (
        <div className='my-8'>
            <div className="search-box p-2 text-center">
                <input
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    type="text"
                    className="py-1 px-4 text-center border-2 rounded-md border-primary w-72"
                    placeholder='Search Medicine '
                />{" "}
                <button className='w-24  border-2 rounded-md border-primary py-1' onClick={handleSearch}>Search</button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 justify-center '>
                {
                    medicine?.map(medicine =>
                        <div key={medicine._id} className="card w-[350px]  mx-auto bg-base-200 hover:shadow-2xl border-2">
                            <div className="card-body">
                                <h2 className="card-title">Medicine  : <span className='font-semibold text-violet-700'>{medicine.name}</span></h2>
                                <div className='space-y-2'>
                                    <div className='flex items-center '>
                                        <p className=' -mr-2'>Group :</p>
                                        <p className='font-semibold text-orange-700 -ml-24'>{medicine.group}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className=' -mr-8'>Company :</p>
                                        <p className='font-semibold text-orange-700'>{medicine.company}</p>
                                    </div>
                                    <div className='flex gap-5 items-center '>
                                        <p className=' -mr-12'> Purpose :</p>
                                        <p className='font-semibold text-orange-700'>{medicine.purpose}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className=' -mr-24'>Price per Unit :</p>
                                        <p className='font-semibold text-orange-700'>{medicine.price_per_unit} tk</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className=' -mr-20'> Expire Date :</p>
                                        <p className='font-semibold text-orange-700'>{medicine.expire_date}</p>
                                    </div>

                                </div>

                                <button onClick={() => handlePaymentAmount(medicine)} className='border-2 border-pink-700 font-semibold hover:bg-pink-500 hover:text-white py-1 px-4 rounded'>Buy Now</button>
                            </div>
                        </div>)
                }
            </div>
        </div>
    );
};

export default Medicine;