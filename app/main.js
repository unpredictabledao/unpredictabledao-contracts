// Connect to Metamask
window.ethereum.request({ method: 'eth_requestAccounts'});

window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
        chainId: "0x228",
        rpcUrls: ["https://arctic-rpc.icenetwork.io:9933/"],
        chainName: "Arctic Network",
        nativeCurrency: {
            name: "ICZ",
            symbol: "ICZ",
            decimals: 18
        },
        blockExplorerUrls: null
    }]
});

// Get provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Get contracts' configurations
const { tokenContractAddress, tokenContractABI, riceContractAddress, riceContractABI  } = config;

// Create contracts' instances
const token = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);
const rice = new ethers.Contract(riceContractAddress, riceContractABI, signer);

// Joined campaigns' indexes
const joinedCampaigns = [];

// Get UGT decimals
let decimals;

(async () => {
    decimals = await token.decimals;
})();

/*
    PARTICIPATION
*/

// Values to enter submissions.
let realValue, dummyValue, maskedValue, doneWithParticipation = true;

rice.on("Submit", async (campaignIndex, participant) => {
    if (participant === await signer.getAddress()) {
        alert(`Submitted to campaign #${campaignIndex}, funds locked.`);

        // Reveal right after submission
        await rice.reveal(campaignIndex, realValue, dummyValue);
    }
});

rice.on("Reveal", async (campaignIndex, participant) => {
    if (participant === await signer.getAddress()) {
        alert(`Revealed values for campaign #${campaignIndex}, funds received.`);

        // Save joined campaign indexes.
        joinedCampaigns.push(BigInt(campaignIndex));
        
        doneWithParticipation = true;
    }
});

async function participate() {
    if ( ethers.BigNumber.from(await signer.getBalance()).lt(ethers.utils.parseEther("5.0")) ) {
        alert("Not enough money to participate!");
        return;
    }

    if (!doneWithParticipation) {
        alert("Last submission has not finished!");
        return;
    };

    realValue = Math.floor(Math.random() * 2147483648);
    
    dummyValue = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
            Math.floor(Math.random() * 10000).toString()
        )
    );

    maskedValue = ethers.utils.solidityKeccak256(
        ["uint", "bytes32"],
        [realValue, dummyValue]
    );

    doneWithParticipation = false;

    await rice.submit(maskedValue, { value: ethers.utils.parseEther("5.0") });
}

const participateButton = document.querySelector("#participate-button");

participateButton.onclick = async () => {
    await participate();
}



/*
    REWARD
*/

rice.on("CollectReward", async (reward, participant) => {
    if (participant === await signer.getAddress()) {
        alert("Received reward: " + BigInt(reward).toString());
    }
});

async function claim() {
    const campaignIndex = document.querySelector("#claim-index").value;

    /*if (!joinedCampaigns.includes(BigInt(campaignIndex))) {
        alert("You did not join the campaign!");
        return;
    };*/

    await rice.collectReward(campaignIndex);
}

const claimButton = document.querySelector("#claim-button");

claimButton.onclick = async () => {
    await claim();
}



/*
    VOTING
*/

// Voting

rice.on("VoteOnCallerFee", async (fee, amount, participant) => {
    if (participant === await signer.getAddress()) {
        alert(`Voted for fee: ${fee} with ${amount} UGTs.`);
    }
});

async function vote() {
    const voteFee = document.querySelector("#vote-fee-index").value;
    const voteAmount = parseInt(document.querySelector("#vote-amount-index").value);

    if (
        ethers.BigNumber.from(await token.balanceOf(await signer.getAddress())).lt(voteAmount)
    ) {
        alert("Not enough UGT to vote!");
        return;
    }

    if (voteAmount < 0) {
        alert("Vote amount can't go below 0.");
        return;
    }

    if (parseInt(voteFee) < 0) {
        alert("Fee can't go below 0.");
        return;
    }

    await token.approve(
        rice.address, 
        ethers.BigNumber.from( BigInt( parseUGT(voteAmount) ) )
    );

    token.on("Approval", async (owner, spender, value) => {
        await rice.voteOnCallerFee(
            ethers.utils.parseEther(voteFee),
            ethers.BigNumber.from( BigInt( parseUGT(voteAmount) ) )
        );
    });
}

const voteButton = document.querySelector("#vote-button");

voteButton.onclick = async () => {
    await vote();
}


// Withdraw

rice.on("WithdrawOnCallerFee", async (fee, participant) => {
    if (participant === await signer.getAddress()) {
        alert(`Withdrawed from voted fee: ${fee}.`);
    }
});

async function withdraw() {
    const votedFee = document.querySelector("#voted-fee-index").value;

    await rice.withdrawOnCallerFee(ethers.utils.parseEther(votedFee));
}

const withdrawButton = document.querySelector("#withdraw-button");

withdrawButton.onclick = async () => {
    await withdraw();
}


/*
    Utilities
*/

function parseUGT(amount) {
    return amount * 10 ** decimals;
}
