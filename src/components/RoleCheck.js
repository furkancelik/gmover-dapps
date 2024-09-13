import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  CHECK_USER_ROLE,
  CHECK_XOG_LIMIT,
  ADD_ROLE,
} from "@/graphql/queries/roleLimit";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TASK } from "@/graphql/queries/task";

const FARMER_ROLE_ID = "1283529173490470966";
const XOG_ROLE_ID = "1283590105445171201";

function ClaimRole({
  refetchRoles,
  roleId,
  title,
  isLimitReached,
  rewards = null,
}) {
  const { data: session } = useSession();
  const [roleAdded, setRoleAdded] = useState(false);
  const [addRole] = useMutation(ADD_ROLE);

  const handleAddRole = async () => {
    if (!session?.discord?.id) return;

    try {
      const { data } = await addRole({
        variables: { userId: session?.discord?.id, roleId },
      });
      console.log("DATA:", data, session?.discord?.id, roleId);
      if (data?.addRoleToUser?.success) {
        rewards && rewards();
        setRoleAdded(true);
        refetchRoles();
        // alert(data.addRoleToUser.message);
      } else {
        throw new Error(data?.addRoleToUser?.message || "Failed to add role");
      }
    } catch (error) {
      alert(`Failed to add role: ${error.message}`);
    }
  };

  if (!session?.discord) return null;

  if (roleAdded) return <p>Role added successfully!</p>;

  if (isLimitReached && roleId === "1283590105445171201")
    return <>xOG role limit reached. Cannot add more xOG roles.</>;

  return <div onClick={handleAddRole}>{title}</div>;
}

export default function RoleCheck({ landId }) {
  const [addTask] = useMutation(ADD_TASK);

  const { data: session } = useSession();
  const {
    loading: loadingFarmer,
    data: farmerData,
    refetch: refetchFarmer,
  } = useQuery(CHECK_USER_ROLE, {
    variables: { userId: session?.discord?.id, roleId: FARMER_ROLE_ID },
    skip: !session?.discord,
  });
  const {
    loading: loadingXOG,
    data: xOGData,
    refetch: refetchXOG,
  } = useQuery(CHECK_USER_ROLE, {
    variables: { userId: session?.discord?.id, roleId: XOG_ROLE_ID },
    skip: !session?.discord,
  });

  const { data: xOGLimitData } = useQuery(CHECK_XOG_LIMIT, {
    variables: { roleId: XOG_ROLE_ID },
    skip: !session,
  });

  const handleAddTask = async () => {
    try {
      await addTask({
        variables: {
          userId: session.user.id,
          landId: landId,
          taskId: "DISCORD_FARMER_ROLE",
          xpReward: 100,
        },
      });
      //   refetchTasks();
      //   refetchTotalXp();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  if (!session?.discord) return <div>Not signed in</div>;
  if (loadingFarmer || loadingXOG) return <div>Checking roles...</div>;

  const hasFarmerRole = farmerData?.checkUserRole;
  const hasXOGRole = xOGData?.checkUserRole;
  const isXOGLimitReached = xOGLimitData?.getRoleLimit
    ? xOGLimitData.getRoleLimit.currentCount >=
      xOGLimitData.getRoleLimit.maxLimit
    : false;

  return (
    <div>
      {!hasFarmerRole && (
        <ClaimRole
          roleId={FARMER_ROLE_ID}
          title="Claim Farmer Role!"
          refetchRoles={refetchFarmer}
          isLimitReached={true}
          rewards={() => {
            handleAddTask();
          }}
        />
      )}
      {hasFarmerRole && !hasXOGRole && (
        <ClaimRole
          roleId={XOG_ROLE_ID}
          title="Claim Early Farmer Role!"
          refetchRoles={refetchXOG}
          isLimitReached={isXOGLimitReached}
        />
      )}
      {hasFarmerRole && hasXOGRole && (
        <p className="line-through opacity-60">Connect DC and claim roles!</p>
      )}
    </div>
  );
}
