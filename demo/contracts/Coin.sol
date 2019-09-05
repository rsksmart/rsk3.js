pragma solidity >=0.4.21 <0.6.0;
// receiver: 7986b3df570230288501eea3d890bd66948c9b79
// sender: cd2a3d9f938e13cd947ec05abc7fe734df8dd826
contract Coin {
    address public minter;
    mapping (address => uint256) public balances;

    event Sent(address from, address to, uint256 amount);
    event Mint(address to, uint256 amount);
    event GetBalance(address target, uint256 amount);
    uint public INITIAL_SUPPLY = 120000;

    constructor() public{
        minter = msg.sender;
        mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address receiver, uint256 amount) public {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
        emit Mint(receiver, amount);
    }
    function send(address receiver, uint256 amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
    function getBalance() public returns (uint256)  {
        emit GetBalance(msg.sender, balances[msg.sender]);
        return balances[msg.sender];
    }
}