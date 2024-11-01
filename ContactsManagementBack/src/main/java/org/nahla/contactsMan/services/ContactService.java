package org.nahla.contactsMan.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.function.BiFunction;

import org.nahla.contactsMan.domaine.Contact;
import org.nahla.contactsMan.domaine.ContactsRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackOn = Exception.class)
@Slf4j
public class ContactService {
	private final ContactsRepo repo;
	
	public Page<Contact> getAllContacts(int page, int size){
		return repo.findAll(PageRequest.of(page, size, Sort.by("name")));
	}
	
	public Contact getContact(String id) {
		return repo.findById(id).orElseThrow(()->new RuntimeException("Contact not found"));
	}
	
	public Contact createContact(Contact c) {
		return repo.save(c);
	}
	
    public void deleteContact(Contact c) {
    	repo.delete(c);
    }
    
    public String uploadPhoto(String id, MultipartFile image) {
    	log.info("Saving photo of user having ID: {}",id);
    	Contact contact= getContact(id);
    	String photoUrl=loadImage.apply(id, image);
    	contact.setPhotoUrl(photoUrl);
    	
    	
    	return photoUrl;
    }
    
    
    private BiFunction<String, MultipartFile, String> loadImage=
    	(id, image)	-> {
    		try {
    		Path fileStorageLocation= Path.of(Constant.PHOTO_DIRECTORY).toAbsolutePath().normalize();
    		if(!Files.exists(fileStorageLocation))
    			Files.createDirectories(fileStorageLocation);
    		String name=image.getOriginalFilename();
    		String extension=name.contains(".")?	name.substring(name.lastIndexOf(".")):".png";
    		Files.copy(image.getInputStream(), fileStorageLocation.resolve(id+extension),StandardCopyOption.REPLACE_EXISTING);
    		return ServletUriComponentsBuilder.fromCurrentContextPath().path("contacts/image/"+
    				id+extension).toUriString();
    		}
    		catch (Exception e)
    		{
    			throw new RuntimeException("File or directory can not be created");
    		}
    		
    	};
    
}
