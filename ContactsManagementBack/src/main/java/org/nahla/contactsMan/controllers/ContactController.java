package org.nahla.contactsMan.controllers;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

import org.nahla.contactsMan.domaine.Contact;
import org.nahla.contactsMan.services.Constant;
import org.nahla.contactsMan.services.ContactService;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.websocket.server.PathParam;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {
	@NonNull
	private ContactService service;
	
	@PostMapping
	public ResponseEntity<Contact> createContact(@RequestBody Contact contact ){
		Contact c= service.createContact(contact);
		return ResponseEntity.created(URI.create("contacts/"+contact.getId())).body(c);
		
	}
	
	@GetMapping("/one/{id}")	
	public ResponseEntity<Contact> getContact(@PathVariable(value = "id")  String id) {
		System.out.println("Je suis là");
	    Contact contact = service.getContact(id);
	    if (contact != null) {
	        return ResponseEntity.ok(contact);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@GetMapping
	public ResponseEntity<Page<Contact>> getContacts(@RequestParam(value = "size", defaultValue="10") int size, @RequestParam(value = "page" , defaultValue="0") int page){
		System.out.println("Non là là");
		return ResponseEntity.ok(service.getAllContacts(page, size));
		
	}
	
	@PutMapping("/photo")
	public ResponseEntity<String> uploadPhoto(@RequestParam(value = "id") String id, @RequestParam(value = "file") MultipartFile file){
		return ResponseEntity.ok(service.uploadPhoto(id, file));
		
	}
	
	@GetMapping(value="/image/{fileUrl}",produces = {"image/png", "image/jpg"} )
	public byte[] getPhoto(@PathVariable String fileUrl) throws IOException{
		return Files.readAllBytes(Path.of(Constant.PHOTO_DIRECTORY+fileUrl));
		
	}
	

}
