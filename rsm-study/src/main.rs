mod balances;
mod system;

#[derive(Debug)]
pub struct Runtime {
    balances: balances::Pallet,
    system: system::Pallet,
}


impl Runtime {
    pub fn new() -> Self {
        Runtime {
            balances: balances::Pallet::new(),
            system: system::Pallet::new(),
        }
    }
}
fn main() {
    println!("Hello, world!");
    let mut runtime = Runtime::new();

    let alice = "alice".to_string();
    let bob = "bob".to_string();
    let charlie = "charlie".to_string();

    runtime.balances.set_balance(&alice, 100);
    runtime.system.inc_block_number();

    assert!(runtime.system.block_number() == 1);
    runtime.system.inc_nonce(&alice);

    let _res = runtime
        .balances
        .transfer(alice.clone(), bob.clone(), 30)
        .map_err(|e| println!("{}", e));

    let _res = runtime
        .balances
        .transfer(alice.clone(), bob.clone(), 30)
        .map_err(|e| println!("{}", e));

    println!("{:#?}", runtime)
}

