import os
import json

# Hardhat project root folder. (where file hardhat.config.ts)
FOLDER_PATH_UNISWAP_TEST_AND_BUY = 'C:/Users/anast/Desktop/alex/uniswap_test_and_buy/'

# Internal files. Used as bridges between js and python
PATH_INPUT_FILE = FOLDER_PATH_UNISWAP_TEST_AND_BUY + 'python_integration/input.json'
PATH_OUTPUT_FILE = FOLDER_PATH_UNISWAP_TEST_AND_BUY + 'python_integration/output.json'

# set default folder
os.chdir(FOLDER_PATH_UNISWAP_TEST_AND_BUY)

# Use this function
# argument token_addresses_list is a LIST: example ['0x6B175474E89094C44Da98b954EedeAC495271d0F', '0x6B175474E89094C44Da98b954EedeAC495271d0F']
# return data example is a DICT with 2 LIST: example {'true': ['0x6B175474E89094C44Da98b954EedeAC495271d0F'], 'false': ['0x6B175474E89094C44Da98b954EedeAC495271d0F']}
# where true - Good token
# where false - Token buy or sell failed
def uniswap_test_and_buy_test(token_addresses_list):
    print('Run hardhat test. Function - uniswap_test_and_buy_test')

    if type(token_addresses_list) is not list:
        raise ValueError('token_addresses_list is not list')

    with open(PATH_INPUT_FILE, 'w') as f:
        json.dump(token_addresses_list, f)

    os.system('npx hardhat test')

    output_data = json.load(open(PATH_OUTPUT_FILE))

    return output_data
