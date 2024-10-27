import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { app } from '../firebaseConfig';
import Modal from './Modal';

// Initialize Firebase services
const storage = getStorage(app);
const firestore = getFirestore(app);

interface FormData {
    [key: string]: string | boolean | File | null;
}

const Form = () => {
    const [formData, setFormData] = useState<FormData>({});
    const [image, setImage] = useState<File | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [variant, setVariant] = useState<'error' | 'success'>('success');

    const triggerModal = (message: string, type: 'error' | 'success') => {
        setModalText(message);
        setVariant(type);
        setShowModal(true);
    };

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

        // check if all required fields are filled
        for (const key in formData) {
            if (typeof formData[key] === 'string' && !formData[key]) {
                triggerModal('Please fill all required fields', 'error');
                return;
            }

            console.log('Key:', key, 'Value:', formData[key]);
        }

        const guid = uuidv4();
        let imageUrl = '';

        if (image) {
            try {
                const compressedImage = await compressImage(image);
                // get file extension
                const ext = image.name.split('.').pop();
                const imageRef = ref(storage, `images/${guid}.${ext}`);
                await uploadBytes(imageRef, compressedImage);
                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Image upload failed:', error);
                triggerModal(`Image upload failed`, 'error');
                return;
            }
        }

        const formWithImage = { ...formData, id: guid, imageUrl };

        console.log('Form data:', formWithImage);

        try {
            await addDoc(collection(firestore, 'forms'), formWithImage);
            // alert('Form submitted successfully!');
            triggerModal('Form submitted successfully!', 'success');
        } catch (error) {
            console.error('Error submitting form:', error);
            triggerModal('Form submission failed', 'error');
        }
    };

    return (
        <div>

            <form className="space-y-4 w-full md:w-[65vw] mx-auto" onSubmit={handleSubmit}>
                <div className='form-control-section'>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">নাম (বাংলায়)</label>
                            <input
                                type="text"
                                name="nameBangla"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label className="form-label required">নাম (ইংরেজিতে)</label>
                            <input
                                type="text"
                                name="nameEnglish"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">পিতার নাম (বাংলায়)</label>
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
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">বর্তমান ঠিকানা: গ্রাম/ মহল্লা-পোস্ট কোড-থানা-জেলা-দেশ</label>
                            <textarea
                                name="presentAddress"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            ></textarea>
                        </div>
                        <div className='form-group'>
                            <label className="form-label required">স্থায়ী ঠিকানা: গ্রাম/ মহল্লা-পোস্ট কোড-থানা-জেলা</label>
                            <textarea
                                name="permanentAddress"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className='form-control-section'>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">দাখিল সেশন</label>
                            <input
                                type="text"
                                name="dakhilSession"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label required'>টি-শার্টের সাইজ নির্বাচন করুন</label>
                            <select
                                name='tshirtSize'
                                onChange={handleInputChange}
                                className='form-control'
                            >
                                <option value='M'>M</option>
                                <option value='L'>L</option>
                                <option value='XL'>XL</option>
                                <option value='XXL'>XXL</option>
                                <option value='XXXL'>XXXL</option>
                            </select>
                        </div>
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">মোবাইল নম্বর</label>
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
                            <label className="form-label required">ইমেইল</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className="form-label required">জন্ম তারিখ</label>
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
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className='form-label required'>পেশা এবং পদবি</label>
                            <input
                                type='text'
                                name='jobAndTitle'
                                onChange={handleInputChange}
                                className='form-control'
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className='form-control-section'>
                    <div className='sm-col-md-row-section'>
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
                            <label className='form-label required'>রেজিস্ট্রেশন ফি এর জন্য দাখিল শিক্ষাবর্ষ নির্বাচন করুন</label>
                            <select
                                name='costCenter'
                                onChange={handleInputChange}
                                className='form-control'
                            >
                                <option value=''> দাখিল শিক্ষাবর্ষ নির্বাচন করুন</option>
                                <option value='2500'>শুরু থেকে ২০১৪ (২৫০০/=টাকা মাত্র)</option>
                                <option value='2000'>২০১৫ থেকে ২০২০ (২০০০/=টাকা মাত্র)</option>
                                <option value='1000'>২০২১ থেকে বর্তমান (১০০০/=টাকা মাত্র)</option>
                            </select>
                        </div>
                    </div>
                    <div className='sm-col-md-row-section'>
                        <div className='form-group'>
                            <label className='form-label required'>কোন মাধ্যমে টাকা প্রদান করবেন</label>
                            <select
                                name='paymentMethod'
                                onChange={handleInputChange}
                                className='form-control'
                            >
                                <option value=''>পেমেন্ট মেথড নির্বাচন করুন</option>
                                <option value='bKash'>বিকাশ</option>
                                <option value='Nogod'>নগদ</option>
                                <option value='Roket'>রকেট</option>
                                <option value='bank'>ব্যাঙ্ক ট্রান্সফার</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label className='form-label required'>প্রদানকৃত টাকার ট্রানজেকশন নাম্বার</label>
                            <input
                                type='text'
                                name='transactionNumber'
                                onChange={handleInputChange}
                                className='form-control'
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className='form-control-section'>
                    <div className='form-group'>
                        <label className="form-label required">একটি ভালো ছবি</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className="form-label">সু-পরামর্শ</label>
                        <textarea rows={4}
                            name="advice"
                            onChange={handleInputChange}
                            className="form-control"
                        ></textarea>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-950 text-white rounded-md shadow-sm hover:bg-green-600"
                >
                    Submit
                </button>
            </form>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                text={modalText}
                variant={variant}
            />
        </div>
    );
};

export default Form;
