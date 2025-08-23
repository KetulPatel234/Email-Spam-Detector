import pandas as pd

# Read the CSV files
csv1 = pd.read_csv('../data/spam_1.csv', header=None, names=['label', 'message', 'col3', 'col4', 'col5'], usecols=['label', 'message'])
csv2 = pd.read_csv('../data/spam_2.csv', usecols=['Body', 'Label'])

# Rename columns for consistency
csv1 = csv1.rename(columns={'message': 'Message', 'label': 'Spam'})
csv2 = csv2.rename(columns={'Body': 'Message', 'Label': 'Spam'})

# Convert 'ham'/'spam' labels in csv1 to 0/1
csv1['Spam'] = csv1['Spam'].map({'ham': 0, 'spam': 1})

# Combine the dataframes
combined_df = pd.concat([csv1[['Message', 'Spam']], csv2[['Message', 'Spam']]], ignore_index=True)

# Save to a new CSV file
combined_df.to_csv('../data/spam.csv', index=False)

print("Combined CSV file 'spam.csv' has been created successfully.")