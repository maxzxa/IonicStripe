export interface BankAccountI {
  routing_number: String,
  account_number: String,
  account_holder_name: String, // optional
  account_holder_type: String, // optional
  currency: String,
  country: String
}