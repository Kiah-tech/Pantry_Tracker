'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, getDocs, getDoc, query, doc, setDoc } from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{ backgroundColor: '#ADD8E6' }}
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              style={{ marginRight: '8px' }}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                background: 'linear-gradient(45deg, #FFB6C1 30%, #ADD8E6 90%)',
                color: '#fff',
                '&:hover': {
                  boxShadow: '0 0 10px 2px rgba(173, 216, 230, 0.8)',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box 
        sx={{
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',  
          borderRadius: '8px',  
        }}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'black'} textAlign={'center'}>
            Pantry Tracker
          </Typography>
        </Box>
        <Box
          width="800px"
          height="50px"
          bgcolor={'#FFB6C1'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          paddingX={'40px'}
        >
          <Typography variant={'h4'} color={'black'}>
            Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'flex'}
                flexGrow={1}
                flexBasis="30%"
                flexShrink={0}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'flex'}
                flexGrow={1}
                flexBasis="30%"
                flexShrink={0}
              >
                Quantity {quantity}
              </Typography>
              <Button
                variant="contained"
                style={{ marginRight: '8px' }}
                onClick={() => addItem(name)}
                sx={{
                  background: 'linear-gradient(45deg, #FFB6C1 30%, #ADD8E6 90%)',
                  color: '#fff',
                  '&:hover': {
                    boxShadow: '0 0 10px 2px rgba(173, 216, 230, 0.8)',
                  },
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={{
                  background: 'linear-gradient(45deg, #FFB6C1 30%, #ADD8E6 90%)',
                  color: '#fff',
                  '&:hover': {
                    boxShadow: '0 0 10px 2px rgba(173, 216, 230, 0.8)',
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(45deg, #FFB6C1 30%, #ADD8E6 90%)',
          color: '#fff',
          '&:hover': {
            boxShadow: '0 0 10px 2px rgba(173, 216, 230, 0.8)',
          },
        }}
      >
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: '125px',
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused': {
              borderColor: '#FFB6C1',
              '& fieldset': {
                borderColor: '#FFB6C1',
              },
            },
            '&:hover fieldset': {
              borderColor: '#FFB6C1',  
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#FFB6C1',
            },
          },
        }}
      />
    </Box>
  );
}

