package org.nahla.contactsMan.domaine;

import org.hibernate.annotations.UuidGenerator;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(Include.NON_DEFAULT)
@Table(name="contacts")
public class Contact {
	@Id
	@UuidGenerator
	private String id;
	private String name;
	private String email;
	private String address;
	private String status;
	private String phone;
	private String photoUrl;

}
