class BalanceList {
    static instance;
    #balances = {};
    static getInstance() {
        if ( ! this.instance ) {
            this.instance = new BalanceList();
        }

        return this.instance;
    }

    createBalance(address, amount ) {
        this.#balances[address] = amount;
    }

    modifyBalance(address, amount) {
        this.#balances[address] += amount;
    }

    hasBalance( address ) {
        return this.#balances.hasOwnProperty(address);
    }

    getBalance( address ) {
        return this.#balances[address];
    }
}

module.exports = BalanceList;
