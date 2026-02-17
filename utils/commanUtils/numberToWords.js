const numberToWords = (amount) => {
    const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertLessThanOneThousand = (num) => {
        let current;
        let words = "";

        if (num % 100 < 20) {
            current = num % 100;
            num = Math.floor(num / 100);
            words = ONES[current];
            if (num === 0) return words;
        } else {
            current = num % 10;
            num = Math.floor(num / 10);
            words = ONES[current];

            current = num % 10;
            num = Math.floor(num / 10);
            words = TENS[current] + (words ? " " + words : "");
        }

        if (num === 0) return words;
        return ONES[num] + " Hundred" + (words ? " and " + words : "");
    };

    const convert = (num) => {
        if (num === 0) return "Zero";

        let words = "";
        let i = 0;

        // Split into Indian formatting groups: 3, 2, 2, 2...
        // 1,00,000 (Lakh), 1,00,00,000 (Crore)

        // Handle Crores
        const crores = Math.floor(num / 10000000);
        if (crores > 0) {
            words += convert(crores) + " Crore ";
            num %= 10000000;
        }

        // Handle Lakhs
        const lakhs = Math.floor(num / 100000);
        if (lakhs > 0) {
            words += convertLessThanOneThousand(lakhs) + " Lakh ";
            num %= 100000;
        }

        // Handle Thousands
        const thousands = Math.floor(num / 1000);
        if (thousands > 0) {
            words += convertLessThanOneThousand(thousands) + " Thousand ";
            num %= 1000;
        }

        // Handle Remaining
        if (num > 0) {
            words += convertLessThanOneThousand(num);
        }

        return words.trim();
    };

    if (!amount || isNaN(amount)) return "Zero Rupees Only";

    // Split decimals if any
    const [integerPart, decimalPart] = String(amount).split(".");

    let result = convert(Number(integerPart)) + " Rupees";

    if (decimalPart && Number(decimalPart) > 0) {
        // pad decimal part to 2 digits if it's like ".5" -> 50 paise
        // If it's ".05" -> 5 paise
        let paise = decimalPart.substring(0, 2);
        if (decimalPart.length === 1) paise += "0";

        result += " and " + convert(Number(paise)) + " Paise";
    }

    return result + " Only";
};

module.exports = numberToWords;
