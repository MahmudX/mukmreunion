import React, { useState } from 'react';

const MobileInput = () => {
    const [mobile, setMobile] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);

    const validateMobileNumber = (input: string) => {
        const mobileRegex = /^01[3-9][0-9]{8}$/;
        return mobileRegex.test(input);
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Update mobile state
        setMobile(inputValue);

        // Validate the mobile number
        const valid = validateMobileNumber(inputValue);
        setIsValid(valid);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Mobile Number</label>
            <input
                type="text"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter mobile number"
                className={`${isValid ? 'border-gray-300' : 'border-red-500'} form-control`}
            />
            {!isValid && <p className="text-red-500 text-sm">Invalid mobile number</p>}
        </div>
    );
};

export default MobileInput;
