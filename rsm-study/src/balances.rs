use std::collections::BTreeMap;

#[derive(Debug)]
pub struct Pallet {
    balances: BTreeMap<String, u128>
}


impl  Pallet {
    pub  fn new() -> Self {
        Pallet {
            balances: BTreeMap::new()
        }
    }
    

    pub fn set_balance(&mut self, account: &String, amount: u128) {
        self.balances.insert(account.clone(), amount);
    }

    pub fn balance(&self, account: &String) -> u128 {
        *self.balances.get(account).unwrap_or(&0)
    }

    pub fn transfer(
        &mut self,
        caller: String,
        to: String,
        amount: u128
    ) -> Result<(), &'static str> {
        let caller_balance = self.balance(&caller);
        let to_balance = self.balance(&to);

        let new_caller_balance = caller_balance.checked_sub(amount).ok_or("Insert");
        let new_to_balance = caller_balance.checked_add(amount).ok_or("Overflow");

        self.balances.insert(caller, new_caller_balance.unwrap());
        self.balances.insert(to, new_to_balance.unwrap());

        Ok(())
    }

}

#[test]
fn init_balances(){
    let mut pallet = Pallet::new();

    assert_eq!(pallet.balance(&"maria".to_string()), 0);


    pallet.set_balance(&"maria".to_string(), 1);
    assert_eq!(pallet.balance(&"maria".to_string()), 1);


    assert_eq!(pallet.balance(&"joao".to_string()), 0);
}