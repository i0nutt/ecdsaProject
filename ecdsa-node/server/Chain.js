
class Chain {
    static instance;
    #blocks = [];
    size = 0;

    static getInstance() {
        if ( ! this.instance ) {
            this.instance = new Chain();
        }

        return this.instance;
    }

    /**
     * Add a new Block to the chain
     *
     * @param {Block} block
     * @returns {boolean} Whether the block was added successfully or not
     */
     addBlock( block ) {
        this.#blocks.push( block );
        this.size ++;

        if ( ! this.isValid() ) {
            this.#blocks.pop();
            this.size --;
            return false;
        }

        return true;
    }

    /**
     * Get last element from the chain
     *
     * @returns {Block} The last block from the chain
     */
    getTopElement () {
        return this.#blocks[ this.size - 1];
    }

    /**
     * Validates whether the current block/transaction chain is valid
     *
     * @returns {boolean} Whether the current chain is valid
     */
    isValid() {

        const lastBlock = this.#blocks[ this.size - 1];

        if( this.size > 1 && lastBlock.prevHash !== this.#blocks[ this.size - 2].hash ) {
            return false;
        }

        for ( let i = 0; i < this.size - 1; i ++ ) {
            if ( this.#blocks[i].hash === lastBlock.hash ) {
                return false;
            }
        }

        return true;
    }

}

module.exports = Chain;
