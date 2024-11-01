package org.nahla.contactsMan.domaine;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactsRepo extends JpaRepository<Contact, String> {

}
