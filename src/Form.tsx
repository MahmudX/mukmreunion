import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { app } from '../firebaseConfig';

// Initialize Firebase services
const storage = getStorage(app);
const firestore = getFirestore(app);

interface FormData {
    [key: string]: string | boolean | File | null;
}

const Form = () => {
    const [formData, setFormData] = useState<FormData>({});
    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData((prevData) => ({
                ...prevData,
                [name]: target.checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && ['image/jpeg', 'image/png', 'image/heic', 'image/jpg'].includes(file.type)) {
            setImage(file);
        } else {
            alert('Please upload a valid image file (jpg/jpeg/png/heic)');
        }
    };

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 3,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Image compression failed:', error);
            return file;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const guid = uuidv4();
        let imageUrl = '';

        if (image) {
            try {
                const compressedImage = await compressImage(image);
                const imageRef = ref(storage, `images/${guid}`);
                await uploadBytes(imageRef, compressedImage);
                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Image upload failed:', error);
                return;
            }
        }

        const formWithImage = { ...formData, id: guid, imageUrl };

        try {
            await addDoc(collection(firestore, 'forms'), formWithImage);
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="space-y-4 w-full md:w-[65vw] mx-auto" onSubmit={handleSubmit}>
            <div className='form-group'>
                <label className="form-label">নাম (বাংলায়)</label>
                <input
                    type="text"
                    name="nameBangla"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">নাম (ইংরেজিতে)</label>
                <input
                    type="text"
                    name="nameEnglish"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">পিতার নাম (বাংলায়)</label>
                <input
                    type="text"
                    name="fatherName"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">মাতার নাম (বাংলায়)</label>
                <input
                    type="text"
                    name="motherName"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">বর্তমান ঠিকানা: গ্রাম/ মহল্লা-পোস্ট কোড-থানা-জেলা-দেশ</label>
                <input
                    type="text"
                    name="presentAddress"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">স্থায়ী ঠিকানা: গ্রাম/ মহল্লা-পোস্ট কোড-থানা-জেলা</label>
                <input
                    type="text"
                    name="permanentAddress"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">দাখিল সেশন</label>
                <input
                    type="text"
                    name="dakhilSession"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">মোবাইল নম্বর</label>
                <input
                    type="tel"
                    maxLength={11}
                    name="mobile"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">ইমেইল</label>
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className='form-group'>
                <label className="form-label">জন্ম তারিখ</label>
                <input
                    type="date"
                    name="dob"
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            {/* Blood group */}
            <div className='form-group'>
                <label className="form-label">রক্তের গ্রুপ</label>
                <select
                    name="bloodGroup"
                    onChange={handleInputChange}
                    className="form-control"
                >
                    <option value="">গ্রুপ নির্বাচন করুন</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </div>

            <div className='form-group'>
                <label className='form-label'>জাতীয় পরিচয়পত্র নং</label>
                <input
                    type='number'
                    name='nid'
                    onChange={handleInputChange}
                    className='form-control'
                    required
                />
            </div>

            <div className='form-group'>
                <label className='form-label'>পেশা এবং পদবি</label>
                <input
                    type='text'
                    name='jobAndTitle'
                    onChange={handleInputChange}
                    className='form-control'
                    required
                />
            </div>

            <div className='form-group'>
                <label className='form-label'>অতিথি সংখ্যা (প্রতি অতিথির জন্য ৭০০ টাকা দিতে হবে)</label>
                <input
                    type='number'
                    name='guestCount'
                    onChange={handleInputChange}
                    className='form-control'
                    required
                />
            </div>
            <div className='form-group'>
                <label className='form-label'>রেজিস্ট্রেশন ফি এর জন্য শিক্ষার্ষ নির্বাচন করুন</label>
                <select
                    name='costCenter'
                    onChange={handleInputChange}
                    className='form-control'
                >
                    <option value=''>শিক্ষার্ষ নির্বাচন করুন</option>
                    <option value='2500'>শুরু থেকে ২০১৪ (২৫০০/=টাকা মাত্র)</option>
                    <option value='2000'>২০১৫ থেকে ২০২০ (২০০০/=টাকা মাত্র)</option>
                    <option value='1000'>২০২১ থেকে বর্তমান (১০০০/=টাকা মাত্র)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Photo Upload</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Single Select Option</label>
                <input
                    type="checkbox"
                    name="singleSelect"
                    onChange={handleInputChange}
                    className="mt-1 block"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Multi Select Options</label>
                <div className="flex gap-4">
                    <label>
                        <input type="checkbox" name="option1" onChange={handleInputChange} />
                        Option 1
                    </label>
                    <label>
                        <input type="checkbox" name="option2" onChange={handleInputChange} />
                        Option 2
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
            >
                Submit
            </button>
        </form>
    );
};

export default Form;
