import { useAppKitAccount } from '@reown/appkit/react';
import { useEstimateGas, useSendTransaction } from 'wagmi';
import { parseGwei } from 'viem';


export const useTransaction = (TEST_TX) => {
    const { address } = useAppKitAccount();
    // console.log("--------------address", address, TEST_TX)
    const { sendTransaction, data: hash } = useSendTransaction();

    const handleSendTx = () => {
        try {
            sendTransaction({
                ...TEST_TX,
            });
        } catch (err) {
            console.log('Error sending transaction:', err);
        }
    };

    return {
        handleSendTx,
        hash,
    };
};