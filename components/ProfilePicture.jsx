
import { getAllUsers } from '@utils/api';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePicture() {

  const {data: session, status} = useSession();

  return ( 
    <div>
       <div className='flex flex-row items-center justify-between gap-1'> 
       <Link href={`/profile/${session?.user?._id}`}>
          {session?.user?.image 
          ? <Image src={session?.user?.image} alt='profile-pic' width={28} height={28} className='object-cover rounded-full'/> 
          : <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={28} height={28} className='object-cover rounded-full'/> 
          }
        </Link>
          <span className='text-sm invisible sm:visible text-slate-500'>{session?.user?.name}</span>
           
        </div>  
        
    
    </div>
  )
}
