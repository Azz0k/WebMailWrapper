import itertools
import concurrent.futures
from timeit import default_timer as timer
import argparse
import CGPCLI
import keyring
import getpass
from typing import *
import base64
import binascii


class CGPROHelper:
    __address: str = ''
    __login: str = ''
    __password: str = ''
    __server: CGPCLI.Server
    # noinspection SpellCheckingInspection
    __full_rights: str = 'cdilrsw'
    __read_rights: str = 'lr'

    def __init__(self, login: str, password: str, address: str = '10.16.252.45') -> None:
        self.__login = login
        self.__password = password
        self.__address = address
        self.__server = CGPCLI.Server(address)

    def __connect(self) -> None:
        self.__server.connect()
        self.__server.login(self.__login, self.__password)

    def __disconnect(self) -> None:
        self.__server.disconnect()

    @staticmethod
    def get_method(method: Callable) -> Any:
        def wrapper(self, *args) -> dict:
            self.__connect()
            result = method(self, *args)
            self.__disconnect()
            return result

        return wrapper

    @staticmethod
    def get_rights():
        return CGPROHelper.__read_rights

    @staticmethod
    def mailbox_name_quoted(mailbox_name: str):
        if mailbox_name.startswith('\"') and mailbox_name.endswith('\"'):
            return mailbox_name
        return '\"{}\"'.format(mailbox_name)

    @staticmethod
    def mailbox_alias(user_name, mailbox_name_raw):
        return '~{}/{}'.format(user_name, mailbox_name_raw)

    @get_method
    def get_domains(self) -> list:
        return self.__server.list_domains()['body']

    @get_method
    def get_users(self, domain_name: str) -> list:
        return list(self.__server.list_accounts(domain_name)['body'].keys())

    @get_method
    def get_groups(self, domain_name: str) -> list:
        return self.__server.list_groups(domain_name)['body']

    @get_method
    def get_group(self, group_name: str, domain_name: str) -> dict:
        return self.__server.get_group(group_name + '@' + domain_name)['body']

    @get_method
    def get_mailbox_rights(self, account_name: str, mailbox_name: str, auth_account_name: str) -> str:
        mailbox_name = CGPROHelper.mailbox_name_quoted(mailbox_name)
        rights = self.__server.get_mailbox_ACL(account_name, mailbox_name, None, None)['body']
        for key in rights:
            if key in auth_account_name:
                return rights[key]
        return ''

    @get_method
    def get_mailboxes(self, account_name) -> dict:
        return self.__server.list_mailboxes(account_name)['body']

    @get_method
    def set_mailbox_rights(self, account_name: str, mailbox_name: str, auth_account_name: str):
        mailbox_name = CGPROHelper.mailbox_name_quoted(mailbox_name)
        new_acl = {auth_account_name: CGPROHelper.get_rights()}
        return self.__server.set_mailbox_ACL(account_name, mailbox_name, new_acl)

    @get_method
    def set_mailbox_aliases(self, account_name: str, new_aliases: dict):
        return self.__server.set_mailbox_aliases(account_name, new_aliases)

    @get_method
    def get_user_settings(self, account_name: str, domain_name: str = 'energospb.ru'):
        keys_to_return = ['description', 'MaxAccountSize', 'ou', 'RealName']
        if '@' not in account_name:
            account_name = '{}@{}'.format(account_name, domain_name)
        temp = self.__server.get_account_effective_settings(account_name)['body']
        return {key: temp[key] for key in temp if key in keys_to_return}

    def get_all_users_by_domains(self) -> dict:
        return {domain: [user for user in self.get_users(domain)] for domain in self.get_domains()}


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('-n', '--newpass', required=False, help='Set new password', action='store_true')
    arguments = parser.parse_args()
    return arguments


def test_domains_and_users():
    password: str = keyring.get_password(system_name, username)
    helper: CGPROHelper = CGPROHelper(username, password)
    print('DOMAINS AND USERS')
    for d in helper.get_domains():
        print(d)
        print(helper.get_users(d))
    print('DOMAINS AND GROUPS')
    for d in helper.get_domains():
        print(d)
        for g in helper.get_groups(d):
            print(g)
            print(helper.get_group(g, d))


def test_get_set_acl2(target_username, calendar_username: str = 'itservicedesk@energospb.ru'):
    password: str = keyring.get_password(system_name, username)
    helper: CGPROHelper = CGPROHelper(username, password)
    mailboxes = helper.get_mailboxes(calendar_username)
    calendars_to_share = []
    for key, value in mailboxes.items():
        # noinspection SpellCheckingInspection
        if key != '&BBoEMAQ7BDUEPQQ0BDAEQARM-':
            if ('Class' in value) and (value['Class'] == 'IPF.Appointment'):
                calendars_to_share.append(key)
    # TODO - change test_user2 to all users in all domains
    result_alias = {}
    for calendar in calendars_to_share:
        helper.set_mailbox_rights(calendar_username, calendar, target_username)
        #print(helper.get_mailbox_rights(calendar_username, calendar, target_username))
        result_alias[calendar] = helper.mailbox_alias(calendar_username, calendar)
    helper.set_mailbox_aliases(target_username, result_alias)


def clear_aliases(user_name):
    password: str = keyring.get_password(system_name, username)
    helper: CGPROHelper = CGPROHelper(username, password)
    helper.set_mailbox_aliases(user_name, {})


def get_one_acc_setting(*args):
    account_name, u_n, u_p = args[0]
    local_helper: CGPROHelper = CGPROHelper(u_n, u_p)
    return local_helper.get_user_settings(account_name)


def test_get_account_settings():
    password: str = keyring.get_password(system_name, username)
    helper: CGPROHelper = CGPROHelper(username, password)
    start = timer()
    domain_name = 'energospb.ru'
    users_names = helper.get_users(domain_name)
    temp_tuple = zip(users_names, itertools.repeat(username),
                     itertools.repeat(password))

    with concurrent.futures.ProcessPoolExecutor() as executor:
        users_data = dict(zip(users_names, executor.map(get_one_acc_setting, temp_tuple)))
    end = timer()
    print(users_data)
    print(end-start)


def test_get_set_acl():
    password: str = keyring.get_password(system_name, username)
    helper: CGPROHelper = CGPROHelper(username, password)
    # print(helper.get_mailboxes('testpublic@energospb.ru'))
    # noinspection SpellCheckingInspection
    test_user1 = 'testpublic@energospb.ru'
    test_user2 = 'testreceiver@energospb.ru'
    # test_user3 = 'boyko.anastasiya@energospb.ru'
    # noinspection SpellCheckingInspection
    knights_hall_mailbox_raw = '&BCAESwRGBDAEQARBBDoEOAQ5- &BDcEMAQ7-'
    knights_hall_mailbox_name = '\"{}\"'.format(knights_hall_mailbox_raw)
    knights_hall_alias = '~{}/{}'.format(test_user1, knights_hall_mailbox_raw)
    knights_hall_dict = {knights_hall_mailbox_raw: knights_hall_alias}
    print('Old rights: ')
    print(helper.get_mailbox_rights(test_user1, knights_hall_mailbox_name, test_user2))
    # helper.set_mailbox_rights(test_user1, knights_hall_mailbox_name, test_user2)
    print('New rights: ')
    print(helper.get_mailbox_rights(test_user1, knights_hall_mailbox_name, test_user2))
    # print(helper.set_mailbox_aliases(test_user2, knights_hall_dict))


if __name__ == '__main__':
    # noinspection SpellCheckingInspection
    full_rights = 'cdilrsw'
    system_name: str = 'cgpro_credentials'
    username: str = 'milokum.pavel@energospb.ru'
    main_args = parse_arguments()
    if main_args.newpass:
        new_password: str = getpass.getpass(prompt='Enter password:')
        try:
            keyring.set_password(system_name, username, new_password)
        except Exception as error:
            print('Error: {}'.format(error))
    else:
        test_get_set_acl2('milokum.pavel@energospb.ru')

