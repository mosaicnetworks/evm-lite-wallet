pragma solidity >=0.4.0;

/// @title Proof of Authority Whitelist Proof of Concept
/// @author Jon Knight
/// @author Mosaic Networks
/// @notice This is a proof of concept and is not production ready


contract MonetPOA {

/// @notice Event emitted when the vote was reached a decision
/// @param _nominee The address of the nominee
/// @param _yesVotes The total number of yes votes cast for the nominee to date
/// @param _noVotes The total number of no votes cast for the nominee to date
/// @param _accepted The decision, true for added to the whitelist, false for rejected
    event NomineeDecision(
        address indexed _nominee,

        uint  _yesVotes,
        uint _noVotes,

		bool indexed _accepted
    );




/// @notice Event emitted when a nominee vote is cast
/// @param _nominee The address of the nominee
/// @param _voter The address of the person who cast the vote
/// @param _yesVotes The total number of yes votes cast for the nominee to date
/// @param _noVotes The total number of no votes cast for the nominee to date
/// @param _accepted The vote, true for accept, false for rejected
    event NomineeVoteCast(
        address indexed _nominee,
		address indexed _voter,

		uint  _yesVotes,
        uint _noVotes,

		bool indexed _accepted
    );





/// @notice Event emitted when a nominee is proposed
/// @param _nominee The address of the nominee
/// @param _moniker The moniker of the nominee
/// @param _proposer The address of the person who proposed the nominee
    event NomineeProposed(
        address indexed _nominee,
        bytes32 indexed _moniker,
		address indexed _proposer
    );





   /// @notice Constructor builds the white list with just the contract owner in it
   /// @param _moniker the name of the contract owner as shown to other users in the wallet
   //  constructor(bytes32 _moniker) public ;
   /// @notice Modifier to check if a sender is on the white list.
    modifier checkWhiteList(address _address)
    {
        _;
    }



   /// @notice Add a new entry to the nominee list
   /// @param _nomineeAddress the address of the nominee
   /// @param _moniker the moniker of the new nominee as displayed during the voting process
    function submitNominee (address _nomineeAddress, bytes32 _moniker) payable public;


   /// @notice wrapper function to retrieve a moniker from the white list
   /// @param _whiteListAddress the address to be looked up
   /// @return a bytes32 value containing the moniker
    function getMoniker(address _whiteListAddress) public view returns (bytes32)  ;


    ///@notice Cast a vote for a nominator. Can only be run by people on the whitelist.
    ///@param _nomineeAddress The address of the nominee
    ///@param _accepted Whether the vote is to accept (true) or reject (false) them.
    ///@return returns true if the vote has reached a decision, false if not
    ///@return only meaningful if the other return value is true, returns true if the nominee is now on the whitelist. false otherwise.
    function castNomineeVote(address _nomineeAddress, bool _accepted) public payable returns (bool, bool);

}




contract POA_Event is MonetPOA {


   struct NomineePerson {
      address person;
      bytes32 moniker;
   }

   struct WhitelistPerson {
      address payable person;
      bytes32 moniker;
      uint  flags;
   }


   struct NomineeVote {
      address voter;
      bool  accept;
   }

   struct NomineeElection{
      NomineePerson nominee;
      address proposer;
      uint yesVotes;
      uint noVotes;
      mapping (address => NomineeVote) vote;
   }


   mapping (address => WhitelistPerson) public whiteList;
   uint whiteListCount;



// Cannot iterate through a mapping, so keep an array in place too.
   mapping (address => NomineeElection) nomineeList;
   address[] nomineeArray;


//TODO remove these
// This is not intended for production release. But in the short term, we are keeping the declined nominee election results available to allow
// simple inspection. In production the additional storage is not justified when it can be retrieved from the blockchain.
   mapping (address => NomineeElection) declineList;
   mapping (address => NomineeElection) acceptList;





   /// @notice Constructor builds the white list with just the contract owner in it
   /// @param _moniker the name of the contract owner as shown to other users in the wallet
    constructor(bytes32 _moniker) public {
       whiteList[address(uint160(msg.sender))] = WhitelistPerson(msg.sender, _moniker, 0);
       whiteListCount = 1;
    }


   /// @notice Modifier to check if a sender is on the white list.
    modifier checkWhiteList(address _address)
    {
        require(isWhitelisted(_address));

        _;
    }


   /// @notice wrapper function to check if an address is on the nominee list
   /// @param _address the address to be checked
   /// @return a boolean value, indicating if _address is on the nominee list
    function isNominee(address _address) private view returns (bool)
    {
        return (nomineeList[_address].nominee.person != address(0));
    }


   /// @notice wrapper function to check if an address is on the white list
   /// @param _address the address to be checked
   /// @return a boolean value, indicating if _address is on the white list
    function isWhitelisted(address _address) private view returns (bool)
    {
        return (whiteList[_address].person != address(0));
    }




   /// @notice Add a new entry to the nominee list
   /// @param _nomineeAddress the address of the nominee
   /// @param _moniker the moniker of the new nominee as displayed during the voting process
    function submitNominee (address _nomineeAddress, bytes32 _moniker) payable public checkWhiteList(msg.sender)
    {
        nomineeList[_nomineeAddress] = NomineeElection({nominee: NomineePerson(_nomineeAddress, _moniker), proposer: msg.sender,
                    yesVotes: 0, noVotes: 0});
        nomineeArray.push(_nomineeAddress);

        emit NomineeProposed(_nomineeAddress, _moniker, msg.sender);
    }


   /// @notice wrapper function to retrieve a moniker from the white list
   /// @param _whiteListAddress the address to be looked up
   /// @return a bytes32 value containing the moniker
    function getMoniker(address _whiteListAddress) public view returns (bytes32)  {
        return whiteList[_whiteListAddress].moniker;
    }

    ///@notice Cast a vote for a nominator. Can only be run by people on the whitelist.
    ///@param _nomineeAddress The address of the nominee
    ///@param _accepted Whether the vote is to accept (true) or reject (false) them.
    ///@return returns true if the vote has reached a decision, false if not
    ///@return only meaningful if the other return value is true, returns true if the nominee is now on the whitelist. false otherwise.
    function castNomineeVote(address _nomineeAddress, bool _accepted) public payable checkWhiteList(msg.sender) returns (bool, bool){

        bool decided = false;
        bool voteresult = false;

//      Check if open nominee, other checks redundant
        if (isNominee(_nomineeAddress)) {


//      Check that this sender has not voted before. Initial config is no redos - so just reject
            if (nomineeList[_nomineeAddress].vote[msg.sender].voter != address(0)) {
                // Vote is valid. So lets cast the Vote
                nomineeList[_nomineeAddress].vote[msg.sender] = NomineeVote({voter: msg.sender, accept: _accepted });

                // Amend Totals
                if (_accepted)
                {
                    nomineeList[_nomineeAddress].yesVotes++;
                } else {
                    nomineeList[_nomineeAddress].noVotes++;
                }

					 emit NomineeVoteCast(_nomineeAddress, msg.sender,nomineeList[_nomineeAddress].yesVotes,
                      nomineeList[_nomineeAddress].noVotes, _accepted);

                // Check to see if enough votes have been cast for a decision
                (decided, voteresult) = checkForNomineeVoteDecision(_nomineeAddress);
            }
        }
        else
        {   // Not a nominee, so set decided to true
            decided = true;
        }


        // If decided, check if on whitelist
        if (decided) {
            voteresult = isWhitelisted(_nomineeAddress);
        }

        return (decided, voteresult);

    }



// This function encapsulates the logic as to whether a vote is complete

    ///@notice This function encapsulates the logic for determining if there are enough votes for a definitive decision
    ///@param _nomineeAddress The address of the NomineeElection
    ///@return returns true if the vote has reached a decision, false if not
    ///@return only meaningful if the other return value is true, returns true if the nominee is now on the whitelist. false otherwise.

    function checkForNomineeVoteDecision(address _nomineeAddress) private returns (bool, bool)
    {
        NomineeElection memory election = nomineeList[_nomineeAddress];
        bool decided = false;
        bool voteresult = false;


        if (election.noVotes > 0)  // Someone Voted No
        {
            declineNominee(election.nominee.person);
            decided = true;
            voteresult = false;
        }
        else
        {
            // Requires unanimous approval
            if(election.yesVotes >= whiteListCount)
            {
                acceptNominee(election.nominee.person, election.nominee.moniker);
                decided = true;
                voteresult = true;
            }
        }

        if (decided)
        {
            emit NomineeDecision(_nomineeAddress, election.yesVotes, election.noVotes, voteresult);
        }
        return (decided, voteresult);
    }


// Adds the user to the white list.


    ///@notice This private function adds the accepted nominee to the whitelist.
    ///@param _nomineeAddress The address of the nominee being added to the whitelist
    ///@param _moniker The moniker of the person being added to the white list.
    function acceptNominee(address _nomineeAddress, bytes32 _moniker) private
    {

       address payable newAddress =  address(uint160(_nomineeAddress));
       whiteList[newAddress] = WhitelistPerson(newAddress, _moniker, 0);
       whiteListCount++;

    //TODO comment out this line. Decline List not intended for production use.
       acceptList[_nomineeAddress] = nomineeList[_nomineeAddress];

    // Remove from nominee list
       removeNominee(_nomineeAddress);



    }


// Remove person from white list. Not currently used, but will be needed.
    ///@notice This private function adds the removes a user from the whitelist. Not currently used.
    ///@param _address The address of the nominee being removed to the whitelist

    function deWhiteList(address _address) private
    {

        if(isWhitelisted(_address))
        {
            delete(whiteList[_address]);
            whiteListCount--;
        }
    }


// Deline nominee from the nomineeList

    ///@notice This private function removes the declined nominee from the nominee list.
    ///@param _nomineeAddress The address of the nominee being removed from the nominee list
    function declineNominee(address _nomineeAddress) private
    {

        //TODO comment out this line. Decline List not intended for production use.
         declineList[_nomineeAddress] = nomineeList[_nomineeAddress];
         removeNominee(_nomineeAddress);
    }


    ///@notice This private function removes the declined nominee from the nominee list.
    ///@param _nomineeAddress The address of the nominee being removed from the nominee list
    function removeNominee(address _nomineeAddress) private
    {

// Remove from Mapping
        delete(nomineeList[_nomineeAddress]);

    }


}
