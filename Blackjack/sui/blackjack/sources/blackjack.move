module blackjack::game {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use sui::vec_set::{Self, VecSet};
    use sui::math;
    use sui::randomness::Random;

    // ===== Constants =====
    const EInvalidGameState: u64 = 0;
    const EInvalidBetAmount: u64 = 1;
    const ENotPlayer: u64 = 2;
    const ENotCasino: u64 = 3;

    // ===== Structs =====
    struct BlackjackGame has key {
        id: UID,
        casino: address,
        player: address,
        status: u8,
        bet: u64,
        dealer_cards: VecMap<u8, Card>,
        player_cards: VecMap<u8, Card>,
        chip_balance: Balance<CHIP>,
    }

    struct Card has store, copy, drop {
        suit: u8,
        number: u8,
    }

    struct CHIP has drop {}

    // ===== Events =====
    struct GameInitialized has copy, drop {
        game_id: ID,
        casino: address,
    }

    struct GameStarted has copy, drop {
        game_id: ID,
        player: address,
    }

    struct BetPlaced has copy, drop {
        game_id: ID,
        player: address,
        amount: u64,
    }

    // ===== Functions =====
    public fun initialize(casino: &mut TxContext) {
        let game = BlackjackGame {
            id: object::new(casino),
            casino: tx_context::sender(casino),
            player: @0x0,
            status: 0, // New
            bet: 0,
            dealer_cards: vec_map::empty(),
            player_cards: vec_map::empty(),
            chip_balance: balance::zero(),
        };

        // Emit initialization event
        event::emit(GameInitialized {
            game_id: object::id(&game),
            casino: tx_context::sender(casino),
        });

        // Transfer game object to casino
        transfer::share_object(game);
    }

    public fun start_game(game: &mut BlackjackGame, player: &mut TxContext) {
        assert!(game.status == 0, EInvalidGameState);
        assert!(tx_context::sender(player) != game.casino, ENotPlayer);

        game.player = tx_context::sender(player);
        game.status = 1; // WaitingForBet

        // Emit game started event
        event::emit(GameStarted {
            game_id: object::id(game),
            player: tx_context::sender(player),
        });
    }

    public fun place_bet(
        game: &mut BlackjackGame,
        bet: Coin<CHIP>,
        player: &mut TxContext
    ) {
        assert!(game.status == 1, EInvalidGameState);
        assert!(tx_context::sender(player) == game.player, ENotPlayer);

        let bet_amount = coin::value(&bet);
        assert!(bet_amount % 100 == 0, EInvalidBetAmount);

        game.chip_balance = balance::join(game.chip_balance, coin::into_balance(bet));
        game.bet = bet_amount;
        game.status = 2; // WaitingForDeal

        event::emit(BetPlaced {
            game_id: object::id(game),
            player: tx_context::sender(player),
            amount: bet_amount,
        });
    }

    // Add more game logic functions here (deal, hit, stand, etc.)

    fun calculate_score(cards: &VecMap<u8, Card>): u8 {
        let score = 0;
        let aces = 0;

        let i = 0;
        while (i < vec_map::length(cards)) {
            let card = vec_map::get(cards, i);
            if (card.number == 1) {
                aces = aces + 1;
                score = score + 11;
            } else if (card.number >= 10) {
                score = score + 10;
            } else {
                score = score + card.number;
            };
            i = i + 1;
        };

        while (score > 21 && aces > 0) {
            score = score - 10;
            aces = aces - 1;
        };

        score
    }
} 